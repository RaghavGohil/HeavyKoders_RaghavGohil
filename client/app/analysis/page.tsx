"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  BarChart2,
  Zap,
  Users,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Summary from "./Summary";
import ContentMetrics from "./ContentMetrics";
import RelatedLinksWordCloud from "./RelatedLinksWordCloud";
import TopUsersAndHashtags from "./TopUsersAndHashtags";
import CorrectFacts from "./CorrectFacts";
import Card from "./Card";
import Stat from "./Stat";
import TimeSeriesChart from "./TimeSeriesChart";
import NetworkGraph from "./NetworkGraph";
import TopicClusters from "./TopicClusters";
import TopPosts from "./TopPosts";
import LazyLoad from "./LazyLoad";

export default function AnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState("reddit");

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
    { date: "2024-12-14", value: 498 },
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
      { id: "cons4", name: "UserGroup4", type: "consumer", size: 6, reach: 5000 },
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
      { source: "amp3", target: "cons4", value: 2 },
    ],
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
    { name: "Education Policy", value: 5, category: "politics" },
  ];

  const platformsData = [
    { name: "Twitter/X", percentage: 42 },
    { name: "Facebook", percentage: 28 },
    { name: "Telegram", percentage: 15 },
    { name: "Instagram", percentage: 8 },
    { name: "TikTok", percentage: 5 },
    { name: "Other", percentage: 2 },
  ];

  const topPosts = [
    {
      id: 1,
      platform: "Twitter/X",
      username: "@influential_account",
      content:
        "BREAKING: New evidence reveals shocking truth about climate change data manipulation! #ClimateHoax",
      engagement: { likes: 3456, shares: 1289, comments: 892 },
      timestamp: "2024-12-14T15:23:45Z",
    },
    {
      id: 2,
      platform: "Facebook",
      username: "Alternative News Network",
      content:
        "The media won't tell you this, but researchers found that these common foods are actually dangerous for your health...",
      engagement: { likes: 2851, shares: 973, comments: 645 },
      timestamp: "2024-12-13T12:34:21Z",
    },
    {
      id: 3,
      platform: "Telegram",
      username: "Truth Channel",
      content:
        "They're hiding this from you: Secret documents expose government plan to control population through new regulations.",
      engagement: { likes: 1764, shares: 842, comments: 397 },
      timestamp: "2024-12-14T09:45:12Z",
    },
  ];

  // Props for child components provided from this page:
  const summaryTitle = "Key Findings & Summary";
  const relatedLinks = [
    { text: "FactCheck.org", url: "https://www.factcheck.org" },
    { text: "Snopes", url: "https://www.snopes.com" },
    { text: "PolitiFact", url: "https://www.politifact.com" },
  ];
  const wordCloudData = [
    { text: "data", frequency: 10 },
    { text: "analytics", frequency: 15 },
    { text: "truth", frequency: 20 },
    { text: "AI", frequency: 25 },
    { text: "misinformation", frequency: 8 },
    { text: "social", frequency: 12 },
    { text: "media", frequency: 18 },
    { text: "facts", frequency: 9 },
    { text: "report", frequency: 7 },
    { text: "analysis", frequency: 17 },
    { text: "monitor", frequency: 11 },
    { text: "verify", frequency: 14 },
  ];
  const topUsers = [
    { username: "@user1", mentions: 1234 },
    { username: "@user2", mentions: 987 },
  ];
  const topHashtags = [
    { hashtag: "example", frequency: 56 },
    { hashtag: "demo", frequency: 42 },
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            <span className="font-semibold text-lg">Back to Home</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search URL, hashtag, or keyword..."
                className="w-full py-3 px-6 bg-black border border-gray-600 rounded-full text-white shadow-sm focus:outline-none placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1.5 p-2 bg-black border border-gray-600 rounded-full hover:bg-gray-800 transition-all duration-300"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Platform Dropdown */}
        <div className="flex items-center mb-10">
          <label htmlFor="platform" className="text-white mr-2">
            Select Platform:
          </label>
          <select
            id="platform"
            className="bg-black border border-gray-600 text-white rounded-full px-3 py-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="reddit">Reddit</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
            <p className="mt-6 text-white text-lg">Analyzing data...</p>
          </div>
        ) : (
          <>
            {/* Query Summary */}
            <LazyLoad>
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white">
                  Analysis: <span className="text-gray-300">{searchQuery}</span>
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  Data from Dec 1, 2024 - Dec 14, 2024 • Showing results from multiple platforms
                </p>
              </div>
            </LazyLoad>

            {/* Summary, Related Links/Word Cloud, Content Metrics, Top Users/Hashtags */}
            <LazyLoad>
                <Card className="mb-10">
                  <Summary title={summaryTitle} />
                </Card>
            </LazyLoad>

            <LazyLoad>
                <Card className="mb-10">
                  <RelatedLinksWordCloud
                    relatedLinks={relatedLinks}
                    wordCloudData={wordCloudData}
                  />
                </Card>
            </LazyLoad>
            
            {/* Topic Clusters */}
            <LazyLoad>
              <Card className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Related Topic Clusters
                </h2>
                <TopicClusters data={topicClustersData} />
                <div className="mt-4 text-base text-gray-400">
                  <p>
                    Visualization of related topics and narratives. Larger bubbles indicate more prevalent topics.
                  </p>
                </div>
              </Card>
            </LazyLoad>

            <LazyLoad>
                <Card className="mb-10">
                  <TopUsersAndHashtags
                    topUsers={topUsers}
                    topHashtags={topHashtags}
                  />
                </Card>
            </LazyLoad>

            {/* Top Stats */}
            <LazyLoad>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Card>
                  <Stat
                    icon={<BarChart2 className="h-6 w-6" />}
                    label="Total Mentions"
                    value="5,432"
                    change={{ value: 32, positive: true }}
                  />
                </Card>
                <Card>
                  <Stat
                    icon={<Zap className="h-6 w-6" />}
                    label="Engagement Rate"
                    value="8.7%"
                    change={{ value: 12, positive: true }}
                  />
                </Card>
                <Card>
                  <Stat
                    icon={<Users className="h-6 w-6" />}
                    label="Reach"
                    value="1.2M"
                    change={{ value: 15, positive: true }}
                  />
                </Card>
                <Card>
                  <Stat
                    icon={<TrendingUp className="h-6 w-6" />}
                    label="Sentiment"
                    value="Negative"
                    change={{ value: 8, positive: false }}
                  />
                </Card>
              </div>
            </LazyLoad>

            {/* Time Series */}
            <LazyLoad>
              <Card className="mb-10">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Similar Posts Spread Over Time
                </h2>
                <TimeSeriesChart data={timeSeriesData} />
              </Card>
            </LazyLoad>

            {/* Network Analysis */}
            <LazyLoad>
              <Card className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Bot Like Activity
                  </h2>
                </div>
                <div className="overflow-hidden w-full h-[300px]">
                  <NetworkGraph data={networkData} />
                </div>
                <div className="mt-4 text-base text-gray-400">
                  <p>
                    The graph below shows accounts that shared this URL and were observed to co-share content within very short time intervals at least twice.
                  </p>
                </div>
              </Card>
            </LazyLoad>

            <LazyLoad>
                <Card className="mb-10">
                  <ContentMetrics
                    sourceScore={75}
                    languageScore={85}
                    coordinationScore={65}
                    botActivityScore={40}
                    isPropagandistic={true}
                  />
                </Card>
            </LazyLoad>

            {/* Correct Facts */}
            <LazyLoad>
              <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CorrectFacts title={"Facts Gathered From Platform"} />
                </Card>
                <Card>
                  <CorrectFacts title={"Facts Gathered From Relevant Sources"} />
                </Card>
              </div>
            </LazyLoad>

            {/* Top Posts */}
            <LazyLoad>
              <Card className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-white">Relevant Factual Posts</h2>
                </div>
                <div className="mt-4 space-y-4">
                  <TopPosts posts={topPosts} />
                </div>
              </Card>
            </LazyLoad>
          </>
        )}
      </div>
      <footer className="py-4 text-center text-gray-600 text-xs">
        <p>© 2025 TruthSeekr.ai · All Rights Reserved.</p>
      </footer>
    </main>
  );
}
