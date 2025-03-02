"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface SummaryProps {
  query:string,
}

const Summary: React.FC<SummaryProps> = ({ query }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        // Use the title as the query for generating the summary
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch_summary`,
          { query: query },
          { withCredentials: true }
        );
        // Assumes the API returns an object with "summary" field
        setSummary(res.data.summary);
      } catch (err: any) {
        setError(
          err.response?.data?.detail || "An error occurred while fetching the summary."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [query]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">{"Key Findings and Summary"}</h2>
      <div className="text-gray-400 text-base">
        {loading
          ? "Loading summary..."
          : error
          ? error
          : summary || query}
      </div>
    </div>
  );
};

export default Summary;
