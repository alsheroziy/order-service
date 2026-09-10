insert into users (id, full_name, role, email, password_hash)
values 
  (gen_random_uuid()::varchar(36), 'Shehroz admin', 'admin', 'admin@example.com', '$2b$10$afUedtgxEny1oWA7gyJ/bOCugEYfPK01h5ljV3OMVdXbEb4Laygrq'),
  (gen_random_uuid()::varchar(36), 'Test user', 'user', 'user@example.com', '$2b$10$afUedtgxEny1oWA7gyJ/bOCugEYfPK01h5ljV3OMVdXbEb4Laygrq')
on conflict (email) do nothing;

insert into products (id, name, price, stock_quantity)
values 
  (gen_random_uuid()::varchar(36), 'oypon 15 Pro Max', 1199.00, 10),
  (gen_random_uuid()::varchar(36), 'MacBook Pro M3', 1999.00, 10),
  (gen_random_uuid()::varchar(36), 'AirPods Pro 2', 249.00, 50),
  (gen_random_uuid()::varchar(36), 'Apple Watch Series 9', 399.00, 30),
  (gen_random_uuid()::varchar(36), 'Sony WH-1000XM5', 349.00, 15)
on conflict do nothing;
