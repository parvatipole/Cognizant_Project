import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export interface DbUser {
  id: string;
  username: string;
  password_hash: string;
  role: "technician" | "admin";
  name: string;
  assigned_location?: string | null;
  assigned_office?: string | null;
}

let pool: mysql.Pool | null = null;

export function isDbEnabled(): boolean {
  return !!process.env.DB_HOST;
}

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function findUserByUsername(username: string): Promise<DbUser | null> {
  if (!isDbEnabled()) return null;
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT id, username, password_hash, role, name, assigned_location, assigned_office FROM users WHERE username = ? LIMIT 1`,
    [username],
  );
  const results = rows as any[];
  if (results.length === 0) return null;
  const row = results[0];
  return {
    id: String(row.id),
    username: row.username,
    password_hash: row.password_hash,
    role: row.role,
    name: row.name,
    assigned_location: row.assigned_location,
    assigned_office: row.assigned_office,
  };
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}