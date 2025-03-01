// app/page.tsx
"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TrendingTopic = ({ title, count, sentiment }: { title: string, count: number, sentiment: 'positive' | 'neutral' | 'negative' }) => {
  // Determine gradient color based on sentiment
  const gradientClass = sentiment === 'positive' 
    ? 'from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30' 
    : sentiment === 'negative' 
      ? 'from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30' 
      : 'from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30';
  
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(`/analysis?query=${encodeURIComponent(title)}`)}
      className={`cursor-pointer bg-gradient-to-r ${gradientClass} backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70">{count.toLocaleString()} mentions</span>
        <span className={`text-sm px-2 py-1 rounded-full ${
          sentiment === 'positive' ? 'bg-emerald-500/30 text-emerald-200' :
          sentiment === 'negative' ? 'bg-rose-500/30 text-rose-200' :
          'bg-blue-500/30 text-blue-200'
        }`}>
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
  
  // Sample trending topics
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
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              VERITY
            </h1>
            <p className="mt-3 text-lg text-slate-300">
              AI-Powered Social Media Analytics for Monitoring Unreliable News
            </p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search URL, hashtag, or keyword..."
                className="w-full py-4 px-6 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-2 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full hover:from-indigo-500 hover:to-blue-400 transition-all duration-300"
              >
                <Search className="h-6 w-6 text-white" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Trending Topics */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">
            Trending Unreliable News Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      
      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-slate-400 text-sm">
        <p>© 2025 VERITY · AI-Powered Misinformation Analytics</p>
      </footer>
    </main>
  );
}