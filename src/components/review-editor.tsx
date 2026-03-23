"use client";

import style from "./review-editor.module.css";
import { createReviewAction } from "@/actions/create-review.action";
import { useActionState, useEffect } from "react";

export default function ReviewEditor({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null,
  );

  useEffect(() => {
    if (state?.error) {
      alert(state.error);
    }
  }, [state]);
  return (
    <section>
      <form className={style.form_container} action={formAction}>
        <textarea
          name="content"
          placeholder="리뷰 내용"
          required
          disabled={isPending}
        />
        <div className={style.submit_container}>
          <input
            name="author"
            placeholder="작성자"
            required
            disabled={isPending}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "등록 중..." : "리뷰 등록"}
          </button>
        </div>
        <input type="hidden" name="bookId" value={bookId} readOnly />
      </form>
    </section>
  );
}
