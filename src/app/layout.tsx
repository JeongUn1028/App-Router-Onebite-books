import "./globals.css";
import Link from "next/link";
import style from "./layout.module.css";

async function Footer() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
  );
  if (!response.ok) {
    return <div>제작 @JeongUn</div>;
  }

  const books = await response.json();
  const totalBooks = books.length;
  return (
    <>
      <div>제작 @JeongUn</div>
      <div>{totalBooks}권의 책이 등록되어 있습니다.</div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>
            <Link href={"/"}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
