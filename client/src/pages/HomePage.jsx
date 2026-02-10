// HomePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:8080";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

import useArticles from "../hooks/useArticles";
import AdUnit from "../components/AdUnit";

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [articles, setArticles] = useState([]);
  const { getPublishedArticles } = useArticles();

  const getMatches = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/matches`);
      setMatches(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getArticles = async () => {
    try {
      const data = await getPublishedArticles({ category: "News" });
      setArticles(data.slice(0, 4)); // Get top 4 news articles
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
    getArticles();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Ongoing":
        return "status-live shadow-lg shadow-red-500/20";
      case "Completed":
        return "status-completed";
      default:
        return "status-upcoming";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white bg-grid-white selection:bg-orange-500/30 font-sans">
      {/* Hero Section */}
      <div className="bg-hero h-[70vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="relative z-10 animate-slide-up">
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Experience Cricket Like Never Before
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            CRICKET <span className="text-orange-500 ml-2">LIVE</span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Stay updated with lightning fast scores, real-time ball-by-ball
            commentary, and exclusive live streams.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-10">
        <AdUnit placement="HomeHero" />
      </div>

      {/* Matches Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Matches</h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full" />
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Live Now
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.length ? (
            matches.map((match, index) => (
              <div key={index} className="premium-card group relative">
                {/* Real-world Badges */}
                <div className="absolute top-0 right-0 p-4 z-10">
                  {index === 0 && (
                    <span className="bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5 shadow-xl">
                      <span className="w-1 h-1 rounded-full bg-black animate-ping" />
                      Trending
                    </span>
                  )}
                  {index === 1 && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl border border-white/5 flex items-center gap-1.5 shadow-xl">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-8 bg-zinc-900/50">
                  <div className="flex justify-between items-start mb-10">
                    <span
                      className={`status-badge ${getStatusClass(match?.matchStatus)}`}
                    >
                      {match?.matchStatus}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                      {new Date(match.matchDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-8 mb-10 relative">
                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center font-black text-xl text-orange-500 shadow-2xl group-hover:scale-110 transition-transform">
                          {match.teams[0].name[0]}
                        </div>
                        <span className="text-xl font-black tracking-tight">
                          {match.teams[0].name}
                        </span>
                      </div>
                      <span className="text-zinc-600 font-black text-sm tracking-widest">
                        TBA
                      </span>
                    </div>

                    <div className="flex items-center justify-center h-px bg-zinc-800/50 relative my-2">
                      <div className="absolute w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black italic uppercase tracking-widest text-zinc-600 shadow-xl group-hover:rotate-12 transition-transform">
                        vs
                      </div>
                    </div>

                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-all duration-300 delay-75">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center font-black text-xl text-zinc-500 shadow-2xl group-hover:scale-110 transition-transform">
                          {match.teams[1].name[0]}
                        </div>
                        <span className="text-xl font-black tracking-tight">
                          {match.teams[1].name}
                        </span>
                      </div>
                      <span className="text-zinc-600 font-black text-sm tracking-widest">
                        TBA
                      </span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-900/50 flex gap-4">
                    {match?.matchStatus === "Ongoing" ? (
                      <>
                        <Link
                          to={`/stream/${match._id}`}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl text-center transition-all active:scale-95 shadow-lg shadow-red-600/20 text-xs uppercase tracking-widest"
                        >
                          Watch Live
                        </Link>
                        <Link
                          to={`/details/${match._id}`}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 px-6 rounded-2xl text-center transition-all active:scale-95 border border-white/5 text-xs uppercase tracking-widest"
                        >
                          Details
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/details/${match._id}`}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-4 px-6 rounded-2xl text-center transition-all active:scale-95 border border-white/5 text-xs uppercase tracking-widest"
                      >
                        {match?.matchStatus === "Completed"
                          ? "View Scorecard"
                          : "Match Details"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-effect rounded-3xl">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl opacity-20">🏏</span>
              </div>
              <p className="text-zinc-500 font-medium">
                No active matches found at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Latest News Section */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Editor's Picks</h2>
            <div className="h-1 w-16 bg-orange-500 rounded-full" />
          </div>
          <Link
            to="/news"
            className="text-sm font-black text-zinc-500 hover:text-orange-500 uppercase tracking-widest transition-colors"
          >
            View All Stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <Link key={i} to={`/news/${article.slug}`} className="group block">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-zinc-900 border border-white/5">
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-20 group-hover:rotate-6 transition-transform">
                    📰
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-[9px] font-black text-white px-2 py-1 rounded uppercase tracking-widest border border-white/10">
                    {article.category}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 italic tracking-tight">
                {article.title}
              </h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">
                {new Date(article.createdAt).toLocaleDateString()} •{" "}
                {article.views} Views
              </p>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-zinc-900 bg-black/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-2xl font-black tracking-tighter">
            CRICKET <span className="text-orange-500 ml-2">LIVE</span>
          </h2>
          <div className="flex space-x-8 text-zinc-400 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
          </div>
          <p className="text-zinc-600 text-sm italic">
            &copy; 2026 Cricket Live. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
