import { pool } from '@/config/db.config';
import { CreateUserDbDto } from '@/dtos/user.dto';
import { IUser } from '@/interfaces/user.interface';
import { Pool, PoolClient } from 'pg';

class UserRepository {
  async findByEmail(email: string, client: Pool | PoolClient = pool): Promise<IUser | null> {
    const query = `
      select id, full_name, email, role, password_hash, created_at
      from users
      where email = $1
      limit 1;
    `;
    const { rows } = await client.query(query, [email]);
    return rows[0] || null;
  }

  async findById(id: string, client: Pool | PoolClient = pool): Promise<IUser | null> {
    const query = `
      select id, full_name, email, role, password_hash, created_at
      from users
      where id = $1
      limit 1;
    `;
    const { rows } = await client.query(query, [id]);
    return rows[0] || null;
  }

  async create(data: CreateUserDbDto, client: Pool | PoolClient = pool): Promise<IUser> {
    const query = `
      insert into users (full_name, email, password_hash, role)
      values ($1, $2, $3, coalesce($4, 'user'))
      returning id, full_name, email, role, created_at;
    `;
    const { rows } = await client.query(query, [
      data.full_name || null,
      data.email,
      data.password_hash,
      data.role || 'user',
    ]);
    return rows[0];
  }
}

export default new UserRepository();
