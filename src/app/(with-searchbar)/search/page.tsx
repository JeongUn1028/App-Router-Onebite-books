import BookItem from "@/components/book-item";
import { BookData } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" },
  );
  if (!res.ok) {
    return <div>검색 결과를 불러오는데 실패했습니다.</div>;
  }
  const searchResults: BookData[] = await res.json();
  return (
    <div>
      {searchResults.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
