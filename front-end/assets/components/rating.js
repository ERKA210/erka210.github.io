import express from 'express';
import pool from './db'; 
const router = express.Router();

// POST /api/ratings - Submit rating and complete order
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { orderId, stars, comment } = req.body;
    const customerId = req.user?.id; // Assuming you have authentication middleware

    if (!customerId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await client.query('BEGIN');

    // 1. Get order details including courier
    const orderQuery = `
      SELECT o.id, o.customer_id, o.status, oc.courier_id
      FROM orders o
      LEFT JOIN order_couriers oc ON o.id = oc.order_id
      WHERE o.id = $1 AND o.customer_id = $2
    `;
    
    const orderResult = await client.query(orderQuery, [orderId, customerId]);
    
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    const order = orderResult.rows[0];
    const courierId = order.courier_id;

    if (!courierId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No courier assigned to this order' });
    }

    // 2. Check if already rated
    const existingRating = await client.query(
      'SELECT id FROM ratings WHERE order_id = $1',
      [orderId]
    );

    if (existingRating.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order already rated' });
    }

    // 3. Insert rating
    const ratingQuery = `
      INSERT INTO ratings (order_id, customer_id, courier_id, stars, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    await client.query(ratingQuery, [orderId, customerId, courierId, stars, comment]);

    // 4. Update order status to 'delivered' if not already
    if (order.status !== 'delivered') {
      await client.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        ['delivered', orderId]
      );
      
      // Add to order status history
      await client.query(
        'INSERT INTO order_status_history (order_id, status, note) VALUES ($1, $2, $3)',
        [orderId, 'delivered', 'Customer received and rated the order']
      );
    }

    // 5. Update courier's average rating
    // First, calculate new average
    const courierStats = await client.query(`
      SELECT 
        c.rating_avg as current_avg,
        c.rating_count as current_count,
        COALESCE(
          (c.rating_avg * c.rating_count + $1) / (c.rating_count + 1),
          $1
        ) as new_avg
      FROM couriers c
      WHERE c.user_id = $2
    `, [stars, courierId]);

    if (courierStats.rows.length > 0) {
      const newAvg = courierStats.rows[0].new_avg;
      
      await client.query(`
        UPDATE couriers 
        SET 
          rating_avg = $1,
          rating_count = rating_count + 1,
          updated_at = NOW()
        WHERE user_id = $2
      `, [newAvg, courierId]);
    } else {
      // If courier doesn't exist in couriers table yet (shouldn't happen but just in case)
      await client.query(`
        INSERT INTO couriers (user_id, rating_avg, rating_count)
        VALUES ($1, $2, 1)
      `, [courierId, stars]);
    }

    // 6. Remove from active orders if exists
    await client.query(
      'DELETE FROM active_orders WHERE order_json->>\'id\' = $1',
      [orderId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      orderId
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Rating submission error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  } finally {
    client.release();
  }
});

// GET /api/ratings/me - Get ratings for current user (as customer or courier)
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user's role
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = userResult.rows[0].role;
    let ratingsQuery;
    let queryParams;

    if (userRole === 'customer') {
      // Get ratings given by this customer
      ratingsQuery = `
        SELECT 
          r.*,
          u.full_name as courier_name,
          u.avatar_url as courier_avatar,
          o.from_place_id,
          o.to_place_id
        FROM ratings r
        JOIN users u ON r.courier_id = u.id
        JOIN orders o ON r.order_id = o.id
        WHERE r.customer_id = $1
        ORDER BY r.created_at DESC
        LIMIT 20
      `;
      queryParams = [userId];
    } else if (userRole === 'courier') {
      // Get ratings received by this courier
      ratingsQuery = `
        SELECT 
          r.*,
          u.full_name as customer_name,
          u.avatar_url as customer_avatar,
          o.from_place_id,
          o.to_place_id
        FROM ratings r
        JOIN users u ON r.customer_id = u.id
        JOIN orders o ON r.order_id = o.id
        WHERE r.courier_id = $1
        ORDER BY r.created_at DESC
        LIMIT 20
      `;
      queryParams = [userId];
    } else {
      return res.json({ items: [] });
    }

    const ratingsResult = await pool.query(ratingsQuery, queryParams);
    
    res.json({
      items: ratingsResult.rows.map(r => ({
        id: r.id,
        orderId: r.order_id,
        stars: r.stars,
        comment: r.comment,
        createdAt: r.created_at,
        targetUser: userRole === 'customer' 
          ? { name: r.courier_name, avatar: r.courier_avatar }
          : { name: r.customer_name, avatar: r.customer_avatar }
      }))
    });

  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
});

// GET /api/ratings/courier/:courierId - Get courier's ratings (public)
router.get('/courier/:courierId', async (req, res) => {
  try {
    const { courierId } = req.params;
    
    const ratingsQuery = `
      SELECT 
        r.*,
        u.full_name as customer_name,
        u.avatar_url as customer_avatar,
        EXTRACT(YEAR FROM AGE(r.created_at)) as years_ago,
        EXTRACT(MONTH FROM AGE(r.created_at)) as months_ago
      FROM ratings r
      JOIN users u ON r.customer_id = u.id
      WHERE r.courier_id = $1
      ORDER BY r.created_at DESC
    `;

    const ratingsResult = await pool.query(ratingsQuery, [courierId]);
    
    // Get courier average rating
    const courierResult = await pool.query(
      'SELECT rating_avg, rating_count FROM couriers WHERE user_id = $1',
      [courierId]
    );

    const courier = courierResult.rows[0] || { rating_avg: 0, rating_count: 0 };

    res.json({
      courier: {
        rating_avg: parseFloat(courier.rating_avg).toFixed(1),
        rating_count: courier.rating_count
      },
      ratings: ratingsResult.rows.map(r => ({
        id: r.id,
        stars: r.stars,
        comment: r.comment,
        createdAt: r.created_at,
        timeAgo: r.years_ago > 0 
          ? `${r.years_ago} жилийн өмнө`
          : `${r.months_ago} сарын өмнө`,
        customer: {
          name: r.customer_name,
          avatar: r.customer_avatar
        }
      }))
    });

  } catch (error) {
    console.error('Get courier ratings error:', error);
    res.status(500).json({ error: 'Failed to get courier ratings' });
  }
});


module.exports = router;
