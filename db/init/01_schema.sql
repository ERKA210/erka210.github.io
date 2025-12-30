BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------
-- ENUMs
-- -----------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer','courier','admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM
  ('created','confirmed','preparing','ready','picked_up','delivering','delivered','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending','paid','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash','card','khan','golomt','tdb','state');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------
-- USERS (нэр/утас/ID)
-- -----------------------------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role          user_role NOT NULL DEFAULT 'customer',
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL UNIQUE,
  student_id    TEXT,                 -- login дээрх ID
  avatar_url    TEXT,
  password_hash TEXT,                 -- хэрэглэх бол
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_student_id_unique
  ON users ((NULLIF(student_id, '')));

-- -----------------------------
-- PLACES (хаанаас/хаашаа dropdown)
-- CU, GS25, GL Burger, "МУИС 7-р байр" гэх мэт бүгд энд орно
-- -----------------------------
CREATE TABLE IF NOT EXISTS places (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind          TEXT NOT NULL,     -- 'store' | 'restaurant' | 'campus' | 'other'
  name          TEXT NOT NULL,     -- "GS25", "CU", "GL Burger", "МУИС 7-р байр"
  detail        TEXT,              -- "7-р байр 207" гэх мэт нэмэлт тайлбар
  address_text  TEXT,
  lat           NUMERIC(10,7),
  lng           NUMERIC(10,7),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_places_kind ON places(kind);
CREATE INDEX IF NOT EXISTS idx_places_name ON places(name);

-- -----------------------------
-- MENUS (place дээр меню байх/байхгүйг ялгана)
-- Багшийн хэлсэн JSON багана: menu_json
-- -----------------------------
CREATE TABLE IF NOT EXISTS menus (
  place_id    UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
  menu_json   JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menus_gin ON menus USING GIN (menu_json);

-- -----------------------------
-- COURIERS (хүргэгч)
-- -----------------------------
CREATE TABLE IF NOT EXISTS couriers (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  rating_avg    NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count  INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------
-- ORDERS (гол захиалга)
-- Зурган дээр: from -> to, date, time, хүргэлтийн үнэ, нийт үнэ
-- -----------------------------
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  customer_id     UUID NOT NULL REFERENCES users(id),
  from_place_id   UUID NOT NULL REFERENCES places(id),
  to_place_id     UUID NOT NULL REFERENCES places(id),

  scheduled_at    TIMESTAMPTZ,   -- сонгосон огноо/цаг (хэрвээ шууд бол null/now())
  status          order_status NOT NULL DEFAULT 'created',

  subtotal_amount INT NOT NULL DEFAULT 0,   -- хоолны дүн
  delivery_fee    INT NOT NULL DEFAULT 0,   -- хүргэлт (ж: 500₮)
  total_amount    INT NOT NULL DEFAULT 0,   -- subtotal + delivery_fee

  note            TEXT,                   -- нэмэлт тайлбар (боломжтой)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- -----------------------------
-- ORDER_ITEMS (сонгосон хоол/ундаа)
-- item_snapshot_json: тухайн үедээ сонгосон сонголтууд (size, нэмэлт гэх мэт)
-- -----------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  menu_item_key      TEXT,               -- menu_json доторх item.id (ж: "kimbap1")
  name               TEXT NOT NULL,       -- "Кимбаб"
  unit_price         INT NOT NULL,
  qty                INT NOT NULL CHECK(qty > 0),

  item_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,

  line_total         INT GENERATED ALWAYS AS (unit_price * qty) STORED
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- -----------------------------
-- ORDER FLOW (3 алхамтай timeline)
-- 1) Захиалга бэлтгэх
-- 2) Хүргэлтэнд гарсан
-- 3) Амжилттай хүргэгдсэн
-- (status_history хэлбэрээр хадгалбал UI-д яг тохирно)
-- -----------------------------
CREATE TABLE IF NOT EXISTS order_status_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     order_status NOT NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_hist_order ON order_status_history(order_id);

-- -----------------------------
-- ORDER_COURIER (захиалгыг ямар хүргэгч авсан)
-- -----------------------------
CREATE TABLE IF NOT EXISTS order_couriers (
  order_id     UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
  courier_id   UUID NOT NULL REFERENCES users(id),
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------
-- PAYMENTS (төлбөр)
-- -----------------------------
CREATE TABLE IF NOT EXISTS payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method       payment_method NOT NULL DEFAULT 'cash',
  status       payment_status NOT NULL DEFAULT 'pending',
  amount       INT NOT NULL CHECK(amount >= 0),
  provider_ref TEXT,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

-- -----------------------------
-- RATINGS (од/сэтгэгдэл)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  courier_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  stars       INT NOT NULL CHECK(stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------
-- REVIEWS (orders/:id/review endpoint-д зориулсан)
-- -----------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  courier_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  rating      INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------
-- RATING_HISTORY (ratings history)
-- -----------------------------
CREATE TABLE IF NOT EXISTS rating_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  courier_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  stars       INT NOT NULL CHECK(stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------
-- DELIVERY_CART_ITEMS (delivery-cart)
-- -----------------------------
CREATE TABLE IF NOT EXISTS delivery_cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT,
  meta       TEXT,
  price      TEXT,
  thumb      TEXT,
  sub        JSONB NOT NULL DEFAULT '[]'::jsonb,
  qty        INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, title, meta, price)
);

-- -----------------------------
-- ACTIVE_ORDERS (draft order state)
-- -----------------------------
CREATE TABLE IF NOT EXISTS active_orders (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  order_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;
