import { pool } from '@/config/db.config';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';
import { IProduct } from '@/interfaces/product.interface';
import { Pool, PoolClient } from 'pg';

class ProductRepository {
  async create(data: CreateProductDto, client: Pool | PoolClient = pool): Promise<IProduct> {
    const query = `
      insert into products (name, price, stock_quantity)
      values ($1, $2, $3)
      returning id, name, price, stock_quantity, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [data.name, data.price, data.stock_quantity]);
    return rows[0];
  }

  async findById(id: string, client: Pool | PoolClient = pool): Promise<IProduct | null> {
    const query = `
      select id, name, price, stock_quantity, created_at, updated_at
      from products
      where id = $1
      limit 1;
    `;
    const { rows } = await client.query(query, [id]);
    return rows[0] || null;
  }

  async findAll(limit: number = 20, offset: number = 0, client: Pool | PoolClient = pool): Promise<IProduct[]> {
    const query = `
      select id, name, price, stock_quantity, created_at, updated_at
      from products
      order by created_at desc
      limit $1 offset $2;
    `;
    const { rows } = await client.query(query, [limit, offset]);
    return rows;
  }

  async update(id: string, data: UpdateProductDto, client: Pool | PoolClient = pool): Promise<IProduct | null> {
    const query = `
      update products
      set name = coalesce($2, name),
          price = coalesce($3, price),
          stock_quantity = coalesce($4, stock_quantity),
          updated_at = now()
      where id = $1
      returning id, name, price, stock_quantity, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [
      id,
      data.name || null,
      data.price !== undefined ? data.price : null,
      data.stock_quantity !== undefined ? data.stock_quantity : null,
    ]);
    return rows[0] || null;
  }

  async decrementStock(id: string, quantity: number, client: Pool | PoolClient = pool): Promise<IProduct | null> {
    const query = `
      update products
      set stock_quantity = stock_quantity - $2,
          updated_at = now()
      where id = $1 and stock_quantity >= $2
      returning id, name, price, stock_quantity, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [id, quantity]);
    return rows[0] || null;
  }

  async incrementStock(id: string, quantity: number, client: Pool | PoolClient = pool): Promise<IProduct | null> {
    const query = `
      update products
      set stock_quantity = stock_quantity + $2,
          updated_at = now()
      where id = $1
      returning id, name, price, stock_quantity, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [id, quantity]);
    return rows[0] || null;
  }

  async findByIdForUpdate(id: string, client: PoolClient): Promise<IProduct | null> {
    const query = `
      select id, name, price, stock_quantity, created_at, updated_at
      from products
      where id = $1
      for update;
    `;
    const { rows } = await client.query(query, [id]);
    return rows[0] || null;
  }

  async delete(id: string, client: Pool | PoolClient = pool): Promise<boolean> {
    const query = `
      delete from products
      where id = $1;
    `;
    const result = await client.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new ProductRepository();
