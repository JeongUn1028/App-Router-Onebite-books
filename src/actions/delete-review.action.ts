"use server";

import { revalidateTag } from "next/cache";

//* 리뷰 삭제 액션
export async function deleteReviewAction(_: any, formData: FormData) {
  const reviewId = formData.get("reviewId")?.toString();
  const bookId = formData.get("bookId")?.toString();
  if (!reviewId) {
    return {
      status: false,
      message: "리뷰 ID가 누락되었습니다.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/${reviewId}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      throw new Error(`리뷰 삭제에 실패했습니다: ${res.statusText}`);
    }
    revalidateTag(`review-${bookId}`);
  } catch (error) {
    console.error("리뷰 삭제 중 오류 발생:", error);
    return {
      status: false,
      message: "리뷰 삭제 중 오류가 발생했습니다.",
    };
  }

  return {
    status: true,
    message: "리뷰가 성공적으로 삭제되었습니다.",
  };
}
