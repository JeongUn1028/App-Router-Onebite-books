# 📚 ONEBITE BOOKS

Next.js **App Router** 기반의 도서 목록 / 검색 / 상세 / 리뷰 예제 프로젝트입니다.
한입북스 강의를 기반으로 App Router의 라우팅, 데이터 페칭, 캐싱, 스트리밍, 서버 액션, 고급 라우팅 패턴, 최적화 기법을 학습하고 직접 구현했습니다.

**🔗 배포 링크:** [https://one-bite-books-app-tawny.vercel.app/](https://one-bite-books-app-tawny.vercel.app/)

---

## 🛠 기술 스택

- Next.js 15
- React 19
- TypeScript
- Server Components + Client Components
- Server Actions
- Parallel Routes / Intercepting Routes

## ✨ 주요 기능

- 홈에서 추천 도서, 전체 도서 목록 조회
- 검색어 기반 도서 검색
- 도서 상세 정보 조회
- 리뷰 등록 / 삭제 (Server Action)
- `revalidateTag` 기반 리뷰 목록 갱신
- 모달 인터셉트 라우팅 (`@modal/(.)book/[id]`)
- 글로벌 에러 및 라우트 단위 에러 처리

## 🗂 라우트 구조

| 경로 | 설명 |
|---|---|
| `/` | 홈 (추천 도서 + 전체 도서) |
| `/search?q=키워드` | 검색 결과 |
| `/book/[id]` | 도서 상세 |
| `/parallel` | Parallel Route 예제 |

## 🔄 캐싱 / 재검증 포인트

- 목록 / 상세 fetch는 `cache: "force-cache"`를 사용해 정적 캐시를 활용
- 추천 목록은 `revalidate: 3`으로 주기적 재검증
- 리뷰 목록은 `next: { tags: ["review-${bookId}"] }` 태그 사용
- 리뷰 등록 / 삭제 후 `revalidateTag("review-${bookId}")`로 상세 리뷰를 최신화

---

## 🚀 시작하기

### 1) 의존성 설치

```bash
npm install
```

### 2) 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```
NEXT_PUBLIC_API_SERVER_URL=http://localhost:12345
```

`NEXT_PUBLIC_API_SERVER_URL`은 도서 / 리뷰 API 서버 주소입니다.

### 3) 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

### 빌드 / 실행 명령어

```bash
npm run build
npm run start
npm run lint
```

---

## 📝 프로젝트 메모

- 루트 레이아웃에 `modal` 슬롯이 포함되어 있어 병렬 라우트를 통한 모달 렌더링을 지원합니다.
- `src/app/@modal/default.tsx`에서 기본 슬롯을 `null`로 반환합니다.
- 검색창은 클라이언트 컴포넌트로 `useSearchParams`와 `router.push`를 사용합니다.

---

## 📖 학습 정리 (App Router)

### 1. Routing

- **Static Routing**: `app/book/page.tsx`
- **Dynamic Routing**: `app/book/[id]/page.tsx`
- **Query String**: props로 자동 전달됨

### 2. Layout 설정

- 경로와 상관없이 공통 layout 적용 가능
- **Route Group**: 소괄호 `()`를 사용해 URL 경로에는 영향을 주지 않으면서 특정 페이지끼리 공통 레이아웃 공유
- **React Server Component**
  - JS Bundle을 줄여 TTI를 줄이는 것이 목적(상호작용이 필요 없는 컴포넌트는 사전 렌더링 시 한 번만 실행)
  - Server / Client Component로 분리하여 Client Component만 JS Bundle로 전달 후 하이드레이션
- **Navigating**: `Link` 태그, `useRouter()`

### 3. Data Fetching

```jsx
const response = await fetch(~api, { cache: "no-store" })
```

- `no-store`: 캐시 저장 안 함 (cache skip)
- `force-cache`: 요청 결과를 무조건 캐싱
- `{ next: { revalidate: sec } }`: 특정 시간 주기로 캐시 업데이트
- `{ next: { tags: ['a'] } }`: 요청 시 데이터 최신화

**Request Memoization**
- 하나의 페이지를 구성하는 여러 컴포넌트의 API 요청 중 중복 요청을 제거하는 최적화 기능
- 단일 서버 렌더링 라이프사이클(Single Render Pass) 동안에만 유효, 동일 요청(URL, 동일 데이터) 기준, 캐시는 즉시 파기
- App Router는 컴포넌트마다 개별적으로 데이터를 요청하기 때문에 동일 데이터를 중복 요청하는 문제가 발생 → 이를 방지하기 위해 필요

### 4. Page Caching

**Full Route Cache**
- 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱 (Static Page에만 적용)
- **Dynamic Page**: 요청마다 데이터가 달라지는 페이지, 캐시되지 않음(`no-store`), 쿠키 / 헤더 / 쿼리스트링 등 동적 함수를 사용하는 경우
- **params vs searchParams**: `params`는 `[id]`와 같은 경로 자체의 변수, `searchParams`는 쿼리스트링에서 오는 변수
- Dynamic Page → Static Page 전환: `generateStaticParams()`

**Route Segment Option**
```jsx
export const dynamicParams = false;
export const dynamic = "auto"; // auto | force-dynamic | force-static | error
```

**Client Router Cache**
- 브라우저에 저장되는 캐시로, 페이지 이동 시 일부 데이터(중복 레이아웃 등)를 보관해 효율적인 전환을 지원

### 5. Streaming & Error Handling

- **Streaming**: 전달할 데이터가 크거나 준비 시간이 오래 걸릴 때 데이터를 조각으로 나눠 전달하는 기술
- **Suspense**: 비동기 작업 중 렌더링을 일시 중단하고 스트리밍으로 부분 렌더링을 돕는 컴포넌트
  - Suspense 바깥(헤더, 푸터 등): 정적으로 빌드 타임에 캐싱되어 빠르게 표시
  - Suspense 안쪽(동적 데이터): 요청마다 분리되어 `fallback`으로 Skeleton UI 제공
  - 기존 `useEffect + useState` 방식과 달리, 서버에서 데이터를 불러오는 동안 HTML 조각과 Skeleton UI를 먼저 스트리밍하므로 TTI/FCP와 UX 측면에서 우수
  - 쿼리 파라미터 변경 시 Skeleton UI를 다시 띄우려면 `key` 옵션 필요

**`use()` 함수 (React 19)**
- Promise나 Context의 결과를 읽어오는 API
- 규칙: ① 컴포넌트 밖에서 생성/캐싱된 Promise만 사용, ② 조건문 / 반복문 내부에서도 사용 가능

```jsx
// 상위 페이지를 정적으로 유지 + 하위에서 use()로 params 해제
function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <div>책 ID: {id}</div>;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1>도서 상세 페이지</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <BookDetail params={params} />
      </Suspense>
    </div>
  );
}
```

**Error Handling**
- 특정 경로의 에러를 처리하는 에러 컴포넌트(하위 경로 전체를 감쌈), Streaming처럼 동작
- `startTransition`으로 `router.refresh()` + `reset()`을 일괄 처리하여 에러 상태 초기화

### 6. Server Action

- 브라우저에서 호출할 수 있는, 서버에서 실행되는 비동기 함수 (form, 버튼 클릭, 무한 스크롤, 디바운스, `useOptimistic` 등에 사용)
- `revalidatePath` / `revalidateTag`로 지정한 재검증 범위의 서버 캐시(Data/Full Route)와 클라이언트 캐시(Router Cache)를 연쇄 무효화하여 데이터 일관성 유지
  - `revalidatePath('/book/${bookId}')`, `revalidatePath('/book/[id]', 'page')`, `revalidatePath('/(with-searchbar)', 'layout')`, `revalidateTag('review-${bookId}')` 등
- **`useActionState`**: Server Action의 실행 결과(에러, 성공 데이터 등)를 관리하는 부모용 Hook — 중복 제출 방지(`isPending`), 에러 핸들링(`state`)에 활용
- **`useFormStatus`**: `<form>` 제출 진행 상태(로딩)만 가져와 UI를 제어하는 자식 컴포넌트용 Hook
  - 반드시 `<form>`의 자식 컴포넌트 내부에서만 호출 가능
  - 컴포넌트 재사용성을 위해 Submit 버튼을 공통 컴포넌트로 분리할 때, 부모가 Server Component일 때 사용

### 7. 고급 라우팅 패턴

**Parallel Routing**
- `@slot/...` 폴더로 하나의 페이지에 여러 페이지를 병렬 렌더링 (소셜 미디어, 관리자 사이트 등에 활용)
- 부모 layout에 props로 전달됨
- 새로고침 시 404 방지를 위해 슬롯 폴더 내부에 `default.tsx` fallback UI가 반드시 필요

**Intercepting Routing**
- 초기 접속이 아닐 때만 동작(Client-side 방식으로 이동)
- `(.)` 동일 레벨, `(..)` 한 단계 위, `(...)` app 폴더 최상위, `(..)(..)` 두 단계 위

**Parallel + Intercepting Routing** → 모달 구현에 활용

### 8. 최적화

**이미지 최적화 (`<Image />`)**
- 브라우저 지원에 따라 WebP/AVIF로 자동 변환
- Lazy Loading: 뷰포트 진입 직전까지 로딩 지연
- `width`, `height` 필수 명시로 Layout Shift 방지
- 기본 quality 설정으로 시각적 손실 없이 용량 최소화

**검색 엔진 최적화 (SEO)**
- 정적 Metadata: 홈페이지, 소개 페이지 등 변하지 않는 페이지
- 동적 Metadata: DB 데이터 / URL 파라미터에 따라 변경되는 페이지
- Metadata 병합/상속: `layout.tsx`의 Metadata가 기본 틀이 되고 하위 `page.tsx`에서 상속
- 특수 Metadata 파일: `favicon.ico`, `opengraph-image.png`, `robots.txt`, `sitemap.xml` 등

**폰트 최적화 (`next/font`)**
- 렌더링 타임에 폰트를 로컬 파일로 다운로드/번들링하여 외부 요청 없이 Zero Layout Shift 달성

**스크립트 최적화 (`next/script`)**
- `<Script />`로 카카오맵, GA, 결제 SDK 등 타사 스크립트의 로딩 순서 제어

**렌더링 및 번들 최적화**
- **Dynamic Import**: 필요 시점에만 Client Component를 불러오는 Code Splitting (무거운 모달, 에디터, 차트 라이브러리 등에 사용 → TTI 축소)
- **PPR (Partial Prerendering)**: 정적 영역은 빌드 타임에 미리 렌더링하고, 동적 영역만 스트리밍하는 최적화 기법
