import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <h1>Каталог компаний</h1>
      <p>
        <Link href="/companies">Перейти к списку компаний →</Link>
      </p>
    </main>
  );
}
