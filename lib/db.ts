import { Pool } from "pg";

// В dev-режиме Next.js пересоздаёт модули при каждом hot-reload.
// Без этого хака каждый reload плодил бы новый Pool и новые соединения к БД.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL не задан. Скопируйте .env.example в .env.local и укажите строку подключения."
    );
  }
  return new Pool({ connectionString, max: 5 });
}

export const pool = global.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}
