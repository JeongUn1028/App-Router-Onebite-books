import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { JSX, Suspense } from "react";

async function SearchResult({ q }: { q?: string }): Promise<JSX.Element> {
  await delay(1000); // 로딩 상태를 확인하기 위해 인위적으로 1초 지연
  
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

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <Suspense key={searchParams.q} fallback={<BookListSkeleton count={3} />}>
      <SearchResult q={searchParams.q || ""} />
    </Suspense>
  );
}
