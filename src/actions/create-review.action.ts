"use server";

import { revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const author = formData.get("author")?.toString() ?? "";

  if (!bookId || !content || !author)
    return { status: false, error: "필수 정보가 누락되었습니다." };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          content,
          author,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`리뷰 등록에 실패했습니다: ${res.statusText}`);
    }

    //* 리뷰 등록 후 해당 책 상세 페이지를 재검증하여 최신 리뷰를 반영
    revalidateTag(`review-${bookId}`);
    return { status: true, message: "리뷰가 성공적으로 등록되었습니다." };
  } catch (error) {
    console.error("리뷰 등록 실패", error);
    return { status: false, error: "리뷰 등록에 실패했습니다." };
  }
}
