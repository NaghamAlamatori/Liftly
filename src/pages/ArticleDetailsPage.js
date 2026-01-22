import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { DUMMY_ARTICLES } from "../lib/dummyArticles";
import { siteImage } from "../lib/publicAssets";

// Fallback image (upload to `site-images/mcp/<id>`)
const imgArticle = siteImage("Articles.png");

function splitParagraphs(content) {
  const text = String(content || "").trim();
  if (!text) return [];
  // Split by blank lines first, fallback to single newlines.
  const blocks = text.split(/\n\s*\n/g).map((s) => s.trim()).filter(Boolean);
  return blocks.length ? blocks : text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const articleId = Number.parseInt(String(id), 10);
        if (!Number.isFinite(articleId)) {
          setError("Invalid article id.");
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("article_id,title,content,image,created_at")
          .eq("article_id", articleId)
          .maybeSingle();

        if (!mounted) return;
        if (fetchError || !data) {
          // Fallback to dummy content so each article page shows full text even without Supabase data.
          const dummy = DUMMY_ARTICLES.find((a) => String(a.article_id) === String(articleId));
          if (dummy) {
            setArticle(dummy);
            return;
          }
          setError(fetchError?.message || "Article not found.");
          return;
        }

        setArticle(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const paragraphs = React.useMemo(() => splitParagraphs(article?.content), [article?.content]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center">
        <SiteNav active="articles" />
      </div>

      <div className="mx-auto w-[1240px] max-w-full px-6 pb-24 pt-10">
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="outline" className="h-[41px] px-8 py-[10px]">
            <Link to="/articles" aria-label="Back to articles">
              Back
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-[hsl(var(--figma-text))]">Loading…</div>
        ) : error ? (
          <div className="mx-auto max-w-[900px] text-center text-[hsl(var(--brand-2))]">{error}</div>
        ) : (
          <div className="mx-auto w-full max-w-[900px]">
            <div className="overflow-hidden rounded-2xl border border-[hsl(var(--brand-soft))] bg-[hsl(var(--figma-surface))]">
              <div className="h-[360px] w-full">
                <img
                  alt=""
                  src={article?.image || imgArticle}
                  onError={(e) => {
                    e.currentTarget.src = imgArticle;
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-10">
                <div className="text-[46px] font-semibold leading-[1.1] tracking-[-1.38px] text-primary">
                  {article?.title || "Untitled"}
                </div>
                <div className="mt-6 space-y-4 text-[18px] leading-7 tracking-[-0.48px] text-[hsl(var(--figma-text))]/90">
                  {paragraphs.length ? (
                    paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <p>No content available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

