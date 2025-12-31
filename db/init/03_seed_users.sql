INSERT INTO users (full_name, phone, student_id, role)
VALUES
('Хулан','99999999','21B1NUM0127','customer'),
('Bat','88888888',NULL,'courier');

INSERT INTO couriers (user_id)
SELECT id FROM users WHERE phone = '88888888';
