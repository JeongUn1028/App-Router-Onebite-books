# ONEBITE BOOKS (section03)

Next.js App Router 기반의 도서 목록/검색/상세/리뷰 예제 프로젝트입니다.

## 기술 스택

- Next.js 15
- React 19
- TypeScript
- Server Components + Client Components
- Server Actions
- Parallel Routes / Intercepting Routes

## 주요 기능

- 홈에서 추천 도서, 전체 도서 목록 조회
- 검색어 기반 도서 검색
- 도서 상세 정보 조회
- 리뷰 등록/삭제 (Server Action)
- `revalidateTag` 기반 리뷰 목록 갱신
- 모달 인터셉트 라우팅 (`@modal/(.)book/[id]`)
- 글로벌 에러 및 라우트 단위 에러 처리

## 라우트 구조

- `/` : 홈 (추천 도서 + 전체 도서)
- `/search?q=키워드` : 검색 결과
- `/book/[id]` : 도서 상세
- `/parallel` : Parallel Route 예제

## 캐싱/재검증 포인트

- 목록/상세 fetch는 `cache: "force-cache"`를 사용해 정적 캐시를 활용합니다.
- 추천 목록은 `revalidate: 3`으로 주기적 재검증됩니다.
- 리뷰 목록은 `next: { tags: ["review-${bookId}"] }` 태그를 사용합니다.
- 리뷰 등록/삭제 후 `revalidateTag("review-${bookId}")`로 상세 리뷰를 최신화합니다.

## 시작하기

### 1) 의존성 설치

```bash
npm install
```

### 2) 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_API_SERVER_URL=http://localhost:12345
```

`NEXT_PUBLIC_API_SERVER_URL`은 도서/리뷰 API 서버 주소입니다.

### 3) 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드/실행 명령어

```bash
npm run build
npm run start
npm run lint
```

## 프로젝트 메모

- 루트 레이아웃에 `modal` 슬롯이 포함되어 있어 병렬 라우트를 통한 모달 렌더링을 지원합니다.
- `src/app/@modal/default.tsx`에서 기본 슬롯을 `null`로 반환합니다.
- 검색창은 클라이언트 컴포넌트로 `useSearchParams`와 `router.push`를 사용합니다.
