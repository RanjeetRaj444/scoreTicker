import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../pages/HomePage";

const AdUnit = ({ placement }) => {
  const [ad, setAd] = useState(null);
  const [impressionSent, setImpressionSent] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/ads`, {
          params: { status: "Active", placement },
        });
        if (data.data && data.data.length > 0) {
          // Select a random ad from the available ones for this placement
          const randomAd =
            data.data[Math.floor(Math.random() * data.data.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error("Ad Unit fetch failed", error);
      }
    };
    fetchAd();
  }, [placement]);

  useEffect(() => {
    if (ad && !impressionSent) {
      axios.post(`${API_BASE_URL}/ads/${ad._id}/impression`).catch(() => {});
      setImpressionSent(true);
    }
  }, [ad, impressionSent]);

  const handleClick = () => {
    if (ad) {
      axios.post(`${API_BASE_URL}/ads/${ad._id}/click`).catch(() => {});
    }
  };

  if (!ad) return null;

  return (
    <div className="w-full my-8 group">
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative rounded-2xl overflow-hidden border border-white/5 transition-transform duration-500 hover:scale-[1.01]"
      >
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-white/5">
            Sponsored
          </span>
        </div>
        <img
          src={ad.imageUrl}
          alt={ad.name}
          className="w-full h-auto object-cover max-h-[120px] md:max-h-[200px]"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-bold text-white uppercase tracking-wider">
            {ad.name} →
          </p>
        </div>
      </a>
    </div>
  );
};

export default AdUnit;
