CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMs
CREATE TYPE user_role AS ENUM ('customer', 'courier', 'admin');
CREATE TYPE order_status AS ENUM ('created','on_the_way','delivered');
CREATE TYPE payment_method AS ENUM ('cash','card');
CREATE TYPE payment_status AS ENUM ('pending','paid','failed');

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  student_id TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PLACES
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- MENUS
CREATE TABLE menus (
  place_id UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
  menu_json JSONB NOT NULL
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  from_place_id UUID REFERENCES places(id),
  to_place_id UUID REFERENCES places(id),
  scheduled_at TIMESTAMPTZ DEFAULT now(),
  status order_status DEFAULT 'created',
  subtotal_amount INT DEFAULT 0,
  delivery_fee INT DEFAULT 0,
  total_amount INT DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_key TEXT,
  name TEXT,
  qty INT,
  unit_price INT,
  line_total INT GENERATED ALWAYS AS (qty * unit_price) STORED,
  item_snapshot_json JSONB DEFAULT '{}'::jsonb
);

-- COURIERS
CREATE TABLE couriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ORDER STATUS HISTORY
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- REVIEWS
CREATE TABLE reviews (
  order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  courier_id UUID REFERENCES users(id),
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
