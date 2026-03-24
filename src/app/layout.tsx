import "./globals.css";
import Link from "next/link";
import style from "./layout.module.css";
import { BookData } from "@/types";

async function Footer() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" },
  );
  if (!response.ok) {
    return <div>제작 @JeongUn</div>;
  }

  const books: BookData[] = await response.json();
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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
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
        {modal}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
