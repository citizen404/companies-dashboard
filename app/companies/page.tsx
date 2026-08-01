import { getCities, getCompanies } from "@/lib/companies";

// Всегда свежие данные из БД, без статического кеширования страницы
export const dynamic = "force-dynamic";

type CompaniesPageProps = {
  searchParams: { q?: string; city?: string };
};

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const q = searchParams.q?.trim() ?? "";
  const city = searchParams.city?.trim() ?? "";

  const [{ items: companies, limited }, cities] = await Promise.all([
    getCompanies({ q, city }),
    getCities(),
  ]);

  const hasFilters = Boolean(q || city);

  return (
    <main className="page">
      <h1>Компании</h1>
      <p className="meta">
        Найдено: {companies.length}
        {limited ? "+" : ""} {companies.length === 1 ? "запись" : "записей"}
      </p>

      {/* Обычная GET-форма: работает без единой строчки клиентского JS,
          состояние поиска/фильтра живёт в URL (?q=...&city=...) —
          можно делиться ссылкой на конкретный отфильтрованный вид. */}
      <form className="filters" action="/companies" method="GET">
        <input
          type="text"
          name="q"
          placeholder="Поиск по названию…"
          defaultValue={q}
          aria-label="Поиск по названию"
        />
        <select name="city" defaultValue={city} aria-label="Фильтр по городу">
          <option value="">Все города</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit">Найти</button>
        {hasFilters && (
          <a className="reset" href="/companies">
            Сбросить
          </a>
        )}
      </form>

      <div className="table-wrap">
        {companies.length === 0 ? (
          <p className="empty">
            Ничего не найдено{hasFilters ? " по заданным условиям" : ""}.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Город</th>
                <th>Рейтинг</th>
                <th>Отзывов</th>
                <th>Сайт</th>
                <th>Телефон</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.category}</td>
                  <td>{c.city}</td>
                  <td className="num">{c.rating ?? "—"}</td>
                  <td className="num">{c.reviews_count}</td>
                  <td>
                    {c.site ? (
                      <a
                        className="site-link"
                        href={c.site}
                        target="_blank"
                        rel="noreferrer"
                      >
                        сайт ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="num">{c.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {limited && (
        <p className="limit-note">
          Показаны первые 200 записей — сузьте поиск, чтобы увидеть более
          точный результат.
        </p>
      )}
    </main>
  );
}
