"use client";

interface NewsArticle {
  id: number;
  headline: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  summary: string;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  if (!articles || articles.length === 0) {
    return (
      <div
        className="glass-card p-6 text-center"
        style={{ color: "var(--muted)" }}
      >
        No news available right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {articles.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex gap-4 p-4 transition-all duration-300"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          {/* Thumbnail */}
          {article.image && (
            <div
              className="hidden h-20 w-28 flex-shrink-0 rounded-lg bg-cover bg-center sm:block"
              style={{
                backgroundImage: `url(${article.image})`,
                backgroundColor: "var(--input-bg)",
              }}
            />
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between">
            <h3
              className="text-sm font-semibold leading-snug line-clamp-2"
              style={{ color: "var(--foreground)" }}
            >
              {article.headline}
            </h3>
            {article.summary && (
              <p
                className="mt-1 text-xs leading-relaxed line-clamp-1"
                style={{ color: "var(--muted)" }}
              >
                {article.summary}
              </p>
            )}
            <div
              className="mt-2 flex items-center gap-2 text-xs"
              style={{ color: "var(--muted)" }}
            >
              <span
                className="rounded-md px-2 py-0.5 font-medium"
                style={{
                  background: "var(--accent-glow)",
                  color: "var(--accent-hover)",
                }}
              >
                {article.source}
              </span>
              <span>·</span>
              <span>{timeAgo(article.datetime)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
