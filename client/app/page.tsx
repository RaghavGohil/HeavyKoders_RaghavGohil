"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const TrendingTopic = ({
  title,
  count,
  sentiment,
}: {
  title: string;
  count: number;
  sentiment: "positive" | "neutral" | "negative";
}) => {
  // In this dark theme, we won't vary colors based on sentiment.
  // Instead, all trending topics share the same minimal styling.
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/analysis?query=${encodeURIComponent(title)}`)}
      className="cursor-pointer bg-transparent border border-gray-700 rounded-xl p-4 transition-all duration-200 hover:scale-105"
    >
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{count.toLocaleString()} mentions</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-white border border-gray-700">
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/analysis?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Sample trending topics data
  const trendingTopics = [
    { title: "Climate Change Denial", count: 12453, sentiment: "negative" as const },
    { title: "Vaccine Misinformation", count: 9872, sentiment: "negative" as const },
    { title: "Election Fraud Claims", count: 15632, sentiment: "negative" as const },
    { title: "AI Safety Concerns", count: 7845, sentiment: "neutral" as const },
    { title: "Public Health Guidelines", count: 6234, sentiment: "positive" as const },
    { title: "Economic Data Misrepresentation", count: 5421, sentiment: "negative" as const },
    { title: "Science News Misrepresentation", count: 8763, sentiment: "negative" as const },
    { title: "Celebrity Health Advice", count: 4532, sentiment: "neutral" as const },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="text-center">
            <h1 className="text-6xl font-mono font-bold bg-gradient-to-r from-yellow-200 via-red-500 to-pink-500 bg-clip-text text-transparent">
              TruthSeekr.ai 
            </h1>
            <p className="mt-3 text-base text-gray-500">
              AI-Powered Social Media Analytics for Monitoring Unreliable News
            </p>
          </div>

          {/* Minimal Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-md mt-10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search URL, hashtag, or keyword..."
                className="w-full py-3 px-4 bg-transparent border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-2 bg-gray-800 rounded-full transition-all duration-200 hover:opacity-90"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Trending Topics */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
            Hot/Trending Topics 🔥🔥🔥
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingTopics.map((topic, index) => (
              <TrendingTopic
                key={index}
                title={topic.title}
                count={topic.count}
                sentiment={topic.sentiment}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-auto py-4 text-center text-gray-600 text-xs">
        <p>© 2025 TruthSeekr.ai · All Rights Reserved.</p>
      </footer>
    </main>
  );
}
