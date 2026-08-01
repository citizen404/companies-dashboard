import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Компании",
  description: "Каталог компаний — поиск и фильтрация",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
