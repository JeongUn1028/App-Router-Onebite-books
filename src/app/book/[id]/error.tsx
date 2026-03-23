"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // 오류를 외부 서비스로 보고하거나 추가적인 처리를 할 수 있습니다.
    console.error("페이지 렌더링 중 오류 발생:", error.message);
  }, [error]);
  return (
    <div>
      <h2>오류가 발생했습니다.</h2>
      <p>죄송합니다. 페이지를 불러오는 과정에서 문제가 발생했습니다.</p>
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh();
            reset();
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
