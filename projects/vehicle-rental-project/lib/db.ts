import { Pool, PoolClient } from 'pg';
import { getEnv } from '@/lib/env';

const poolConfig = getEnv.db.url()
  ? { connectionString: getEnv.db.url() }
  : {
      host: getEnv.db.host(),
      port: getEnv.db.port(),
      database: getEnv.db.name(),
      user: getEnv.db.user(),
      password: getEnv.db.password(),
    };

const pool = new Pool({ ...poolConfig, max: 1 });

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default pool;
