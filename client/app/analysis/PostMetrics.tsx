import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import Stat from "./Stat";
import { BarChart2, Zap, Users, TrendingUp } from "lucide-react";

interface Metrics {
  total_mentions: number;
  engagement_rate: number; // as a fraction, e.g. 0.087 for 8.7%
  reach: number;
  sentiment: number; // sentiment polarity (-1 to 1)
}

interface PostMetricsProps {
  postUrl: string;
}

export const PostMetrics: React.FC<PostMetricsProps> = ({ postUrl }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postUrl) return;
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post_metrics`,
        { url: postUrl },
        { withCredentials: true }
      )
      .then((res) => {
        setMetrics(res.data.metrics);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching post metrics:", err);
        setError("Failed to load metrics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postUrl]);

  // Helper to format numbers with commas.
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Helper to format reach in shorthand (K/M).
  const formatReach = (num: number): string => {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Helper to format engagement rate as a percentage.
  const formatEngagementRate = (rate: number): string => {
    return (rate * 100).toFixed(1) + "%";
  };

  // Helper to convert sentiment score to a label.
  const sentimentLabel = (sentiment: number): string => {
    if (sentiment > 0.1) return "Positive";
    if (sentiment < -0.1) return "Negative";
    return "Neutral";
  };

  if (loading) {
    return <p>Loading metrics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!metrics) {
    return <p>No metrics available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <Card>
        <Stat
          icon={<BarChart2 className="h-6 w-6" />}
          label="Total Mentions"
          value={formatNumber(metrics.total_mentions)}
        />
      </Card>
      <Card>
        <Stat
          icon={<Zap className="h-6 w-6" />}
          label="Engagement Rate"
          value={formatEngagementRate(metrics.engagement_rate)}
        />
      </Card>
      <Card>
        <Stat
          icon={<Users className="h-6 w-6" />}
          label="Reach"
          value={formatReach(metrics.reach)}
        />
      </Card>
      <Card>
        <Stat
          icon={<TrendingUp className="h-6 w-6" />}
          label="Sentiment"
          value={sentimentLabel(metrics.sentiment)}
        />
      </Card>
    </div>
  );
};

export default PostMetrics;
