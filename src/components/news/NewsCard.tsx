import type { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
              {article.ticker}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
            {article.title}
          </h4>
          {article.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {article.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">{article.source}</p>
        </div>
      </div>
    </a>
  );
}
