export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  ticker: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total: number;
}
