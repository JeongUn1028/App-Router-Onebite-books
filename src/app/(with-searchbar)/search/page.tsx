import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";

import { JSX, Suspense } from "react";

async function SearchResult({ q }: { q?: string }): Promise<JSX.Element> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" },
  );
  if (!res.ok) {
    throw new Error("검색 결과를 불러오는데 실패했습니다.");
  }
  const books: BookData[] = await res.json();
  return (
    <div>
      {books.map((book: BookData) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const param = await searchParams;
  const q = param?.q || "";
  return (
    <Suspense key={q} fallback={<BookListSkeleton count={3} />}>
      <SearchResult q={q} />
    </Suspense>
  );
}
