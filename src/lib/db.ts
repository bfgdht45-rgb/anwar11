import { Pool } from 'pg';

// إنشاء connection pool مباشر بـ PostgreSQL (بدون Prisma)
const globalForPool = globalThis as unknown as {
  pgPool: Pool | undefined;
};

export const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== 'production') globalForPool.pgPool = pool;

// Helper functions لتنفيذ queries
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// الحفاظ على Prisma للـ seed و setup (لو محتاجينه)
export { pool as db };
