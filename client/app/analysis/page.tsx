"use client";

import { useEffect, useState } from "react";
import { Search, ArrowLeft, Share2, BarChart2, Zap, Users, TrendingUp, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Card from ".//Card";
import Stat from "./Stat";
import TimeSeriesChart from "./TimeSeriesChart";
import NetworkGraph from "./NetworkGraph";
import TopicClusters from "./TopicClusters";
import TopPosts from "./TopPosts";

export default function AnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve query from URL
  useEffect(() => {
    const query = searchParams?.get("query");
    if (query) {
      setSearchQuery(query);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      router.push(`/analysis?query=${encodeURIComponent(searchQuery)}`);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Sample data for charts and posts
  const timeSeriesData = [
    { date: "2024-12-01", value: 234 },
    { date: "2024-12-02", value: 278 },
    { date: "2024-12-03", value: 189 },
    { date: "2024-12-04", value: 312 },
    { date: "2024-12-05", value: 345 },
    { date: "2024-12-06", value: 290 },
    { date: "2024-12-07", value: 387 },
    { date: "2024-12-08", value: 423 },
    { date: "2024-12-09", value: 367 },
    { date: "2024-12-10", value: 456 },
    { date: "2024-12-11", value: 521 },
    { date: "2024-12-12", value: 489 },
    { date: "2024-12-13", value: 534 },
    { date: "2024-12-14", value: 498 }
  ];

  const networkData = {
    nodes: [
      { id: "source1", name: "UnreliableSource.org", type: "source", size: 20, reach: 150000 },
      { id: "source2", name: "FakeNewsDaily", type: "source", size: 15, reach: 95000 },
      { id: "amp1", name: "@influencer1", type: "amplifier", size: 12, reach: 78000 },
      { id: "amp2", name: "@influencer2", type: "amplifier", size: 14, reach: 82000 },
      { id: "amp3", name: "@news_aggregator", type: "amplifier", size: 10, reach: 45000 },
      { id: "cons1", name: "UserGroup1", type: "consumer", size: 8, reach: 12000 },
      { id: "cons2", name: "UserGroup2", type: "consumer", size: 9, reach: 15000 },
      { id: "cons3", name: "UserGroup3", type: "consumer", size: 7, reach: 8000 },
      { id: "cons4", name: "UserGroup4", type: "consumer", size: 6, reach: 5000 }
    ],
    links: [
      { source: "source1", target: "amp1", value: 5 },
      { source: "source1", target: "amp2", value: 3 },
      { source: "source2", target: "amp2", value: 4 },
      { source: "source2", target: "amp3", value: 3 },
      { source: "amp1", target: "cons1", value: 2 },
      { source: "amp1", target: "cons2", value: 2 },
      { source: "amp2", target: "cons2", value: 2 },
      { source: "amp2", target: "cons3", value: 2 },
      { source: "amp3", target: "cons3", value: 2 },
      { source: "amp3", target: "cons4", value: 2 }
    ]
  };

  const topicClustersData = [
    { name: "Election Fraud", value: 40, category: "politics" },
    { name: "Vaccine Myths", value: 35, category: "health" },
    { name: "Climate Denial", value: 30, category: "environment" },
    { name: "Economic Collapse", value: 25, category: "economy" },
    { name: "Deep State", value: 20, category: "politics" },
    { name: "COVID Origins", value: 18, category: "health" },
    { name: "Market Manipulation", value: 15, category: "economy" },
    { name: "AI Dangers", value: 12, category: "technology" },
    { name: "Government Surveillance", value: 10, category: "technology" },
    { name: "Media Bias", value: 8, category: "other" },
    { name: "Celebrity Scandals", value: 7, category: "other" },
    { name: "Education Policy", value: 5, category: "politics" }
  ];

  const platformsData = [
    { name: "Twitter/X", percentage: 42 },
    { name: "Facebook", percentage: 28 },
    { name: "Telegram", percentage: 15 },
    { name: "Instagram", percentage: 8 },
    { name: "TikTok", percentage: 5 },
    { name: "Other", percentage: 2 }
  ];

  const topPosts = [
    {
      id: 1,
      platform: "Twitter/X",
      username: "@influential_account",
      content: "BREAKING: New evidence reveals shocking truth about climate change data manipulation! #ClimateHoax",
      engagement: { likes: 3456, shares: 1289, comments: 892 },
      timestamp: "2024-12-14T15:23:45Z"
    },
    {
      id: 2,
      platform: "Facebook",
      username: "Alternative News Network",
      content: "The media won't tell you this, but researchers found that these common foods are actually dangerous for your health...",
      engagement: { likes: 2851, shares: 973, comments: 645 },
      timestamp: "2024-12-13T12:34:21Z"
    },
    {
      id: 3,
      platform: "Telegram",
      username: "Truth Channel",
      content: "They're hiding this from you: Secret documents expose government plan to control population through new regulations.",
      engagement: { likes: 1764, shares: 842, comments: 397 },
      timestamp: "2024-12-14T09:45:12Z"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-white hover:text-indigo-300 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center">
            <button className="bg-slate-800/60 rounded-full p-2 text-slate-300 hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search URL, hashtag, or keyword..."
                className="w-full py-3 px-5 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-400"
              />
              <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full hover:from-indigo-500 hover:to-blue-400 transition-all duration-300">
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300">Analyzing data...</p>
          </div>
        ) : (
          <>
            {/* Query Summary */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                Analysis: <span className="text-indigo-400">{searchQuery}</span>
              </h1>
              <p className="text-slate-400 mt-2">
                Data from Dec 1, 2024 - Dec 14, 2024 • Showing results from multiple platforms
              </p>
            </div>
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <Stat icon={<BarChart2 className="h-5 w-5" />} label="Total Mentions" value="5,432" change={{ value: 32, positive: true }} />
              </Card>
              <Card>
                <Stat icon={<Zap className="h-5 w-5" />} label="Engagement Rate" value="8.7%" change={{ value: 12, positive: true }} />
              </Card>
              <Card>
                <Stat icon={<Users className="h-5 w-5" />} label="Reach" value="1.2M" change={{ value: 15, positive: true }} />
              </Card>
              <Card>
                <Stat icon={<TrendingUp className="h-5 w-5" />} label="Sentiment" value="Negative" change={{ value: 8, positive: false }} />
              </Card>
            </div>
            
            {/* Time Series */}
            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Spread Over Time</h2>
              <TimeSeriesChart data={timeSeriesData} />
            </Card>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Network Analysis</h2>
                  <div className="relative">
                    <button className="text-sm flex items-center text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full">
                      <span>Filter</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
                <NetworkGraph data={networkData} />
                <div className="mt-3 text-sm text-slate-400">
                  <p>Network visualization showing the propagation of content from sources through amplifiers to consumer groups.</p>
                </div>
              </Card>
              
              <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Platform Distribution</h2>
                <div className="space-y-4">
                  {platformsData.map((platform, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{platform.name}</span>
                        <span className="text-slate-400">{platform.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full" style={{ width: `${platform.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Topic Clusters */}
            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Topic Clusters</h2>
              <TopicClusters data={topicClustersData} />
              <div className="mt-3 text-sm text-slate-400">
                <p>Visualization of related topics and narratives. Larger bubbles indicate more prevalent topics.</p>
              </div>
            </Card>
            
            {/* Top Posts */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Top Posts</h2>
                <div className="relative">
                  <button className="text-sm flex items-center text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full">
                    <span>Sort by Engagement</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <TopPosts posts={topPosts} />
            </Card>
          </>
        )}
      </div>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© 2025 VERITY · AI-Powered Misinformation Analytics</p>
      </footer>
    </main>
  );
}
