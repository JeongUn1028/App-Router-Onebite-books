import { BookData } from "@/types";
import style from "./page.module.css";
import { notFound } from "next/navigation";

//! SSG 방식으로 사전에 렌더링할 경로를 고정
// export const dynamicParams = false;

//* SSG 방식으로 사전에 렌더링할 경로를 정의
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string | string[] }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`,
    { cache: "force-cache" },
  );
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    return <div>도서 정보를 불러오는데 실패했습니다.</div>;
  }
  const book: BookData = await res.json();
  const { title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} alt={title} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
