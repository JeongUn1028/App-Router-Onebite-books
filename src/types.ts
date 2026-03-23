interface BookData {
  id: number;
  title: string;
  subTitle: string;
  author: string;
  publisher: string;
  description: string;
  coverImgUrl: string;
}

interface ReviewData {
  id: number;
  content: string;
  author: string;
  bookId: number;
  createdAt: string;
}

export type { BookData, ReviewData };
