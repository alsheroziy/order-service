create extension if not exists "pgcrypto";

create table if not exists users (
    id varchar(36) primary key default gen_random_uuid()::varchar(36),
    full_name varchar(200),
    role varchar(20) not null default 'user' check (role in ('user', 'admin')),
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    created_at timestamp default current_timestamp
);

create table if not exists products (
    id varchar(36) primary key default gen_random_uuid()::varchar(36),
    name varchar(255) not null,
    price numeric(12, 2) not null check (price >= 0),
    stock_quantity integer not null check (stock_quantity >= 0),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table if not exists orders (
    id varchar(36) primary key default gen_random_uuid()::varchar(36),
    user_id varchar(36) not null references users(id) on delete cascade,
    idempotency_key varchar(255) not null unique,
    status varchar(20) not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    total_amount numeric(12, 2) not null default 0,
    expires_at timestamp not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table if not exists order_items (
    id varchar(36) primary key default gen_random_uuid()::varchar(36),
    order_id varchar(36) not null references orders(id) on delete cascade,
    product_id varchar(36) not null references products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    unit_price numeric(12, 2) not null check (unit_price >= 0),
    created_at timestamp default current_timestamp
);

create index if not exists idx_orders_user_id on orders (user_id);
create index if not exists idx_orders_status_expires_at on orders (status, expires_at);
create index if not exists idx_orders_idempotency_key on orders (idempotency_key);
create index if not exists idx_order_items_order_id on order_items (order_id);
create index if not exists idx_products_created_at on products (created_at);
