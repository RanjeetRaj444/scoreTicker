import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useArticles from "../hooks/useArticles";

const ArticlePage = () => {
  const { slug } = useParams();
  const { getArticleBySlug, loading } = useArticles();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticleBySlug(slug).then(setArticle).catch(console.error);
  }, [slug]);

  if (loading || !article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Hero Banner */}
      <div className="h-[60vh] relative overflow-hidden">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            className="w-full h-full object-cover opacity-60"
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-orange-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded">
              {article.category}
            </span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              {new Date(article.createdAt).toDateString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 border-t border-white/10 pt-8">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
              ✍️
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                Author
              </p>
              <p className="font-bold text-sm tracking-tight">
                {article.author?.name || "Editorial Team"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="article-content text-zinc-300 text-lg leading-relaxed font-medium space-y-8">
          {article.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
          <Link
            to="/"
            className="text-sm font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <span>←</span> Back Home
          </Link>
          <div className="flex gap-4">
            {article.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
