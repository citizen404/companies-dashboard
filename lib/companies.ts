import { pool } from "./db";

export type Company = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string | null;
  rating: number | null;
  reviews_count: number;
  site: string | null;
  phone: string | null;
};

const RESULTS_LIMIT = 200;

export async function getCompanies(params: {
  q?: string;
  city?: string;
}): Promise<{ items: Company[]; limited: boolean }> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  const q = params.q?.trim();
  if (q) {
    values.push(`%${q}%`);
    conditions.push(`co.name ILIKE $${values.length}`);
  }

  const city = params.city?.trim();
  if (city) {
    values.push(city);
    conditions.push(`ci.name = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Берём на 1 запись больше лимита, чтобы понять, обрезали ли мы выдачу
  const { rows } = await pool.query<Company>(
    `
    SELECT co.id, co.name, c.name AS category, ci.name AS city, co.address,
           co.rating, co.reviews_count, co.site, co.phone
    FROM companies co
    JOIN categories c ON c.id = co.category_id
    JOIN cities ci ON ci.id = co.city_id
    ${where}
    ORDER BY co.name
    LIMIT ${RESULTS_LIMIT + 1}
    `,
    values
  );

  const limited = rows.length > RESULTS_LIMIT;
  return { items: rows.slice(0, RESULTS_LIMIT), limited };
}

export async function getCities(): Promise<string[]> {
  const { rows } = await pool.query<{ name: string }>(
    `SELECT name FROM cities ORDER BY name`
  );
  return rows.map((r: { name: string }) => r.name);
}
