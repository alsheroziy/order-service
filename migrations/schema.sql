create extension if not exists "pgcrypto";

create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    full_name varchar(200),
    role varchar(20) not null default 'user' check (role in ('user', 'admin')),
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    created_at timestamp with time zone default current_timestamp
);

create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    price numeric(12, 2) not null check (price >= 0),
    stock_quantity integer not null check (stock_quantity >= 0),
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    status varchar(20) not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    total_amount numeric(12, 2) not null default 0,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

create table if not exists order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    product_id uuid not null references products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    unit_price numeric(12, 2) not null check (unit_price >= 0)
);

create table if not exists idempotency_records (
    idempotency_key varchar(255) primary key,
    user_id uuid not null references users(id) on delete cascade,
    order_id uuid references orders(id) on delete set null,
    response_code integer not null,
    response_body jsonb not null,
    created_at timestamp with time zone default current_timestamp
);

create index if not exists idx_orders_status_created_at on orders (status, created_at);
create index if not exists idx_order_items_order_id on order_items (order_id);
create index if not exists idx_products_created_at on products (created_at);
