"use client";

import React from "react";

interface ContentMetricsProps {
  sourceScore: number;
  languageScore: number;
  coordinationScore: number;
  botActivityScore: number;
  isPropagandistic: boolean;
}

const ContentMetrics: React.FC<ContentMetricsProps> = ({
  sourceScore,
  languageScore,
  coordinationScore,
  botActivityScore,
  isPropagandistic,
}) => {
  // Helper function to render a metric with a progress bar
  const renderMetric = (label: string, score: number) => (
    <div className="mb-4">
      <div className="flex justify-between">
        <span className="text-white">{label}</span>
        <span className="text-gray-400">{score}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-black">
      <h2 className="text-2xl font-bold text-white mb-4">Content Analysis Metrics</h2>
      {renderMetric("Source", sourceScore)}
      {renderMetric("Language", languageScore)}
      {renderMetric("Coordination", coordinationScore)}
      {renderMetric("Bot-like Activity", botActivityScore)}
      <div className="flex items-center mt-6">
        <span className="text-2xl font-bold text-white mr-2">Propaganda Verdict:</span>
        <span className={`text-2xl font-bold ${isPropagandistic ? "text-red-500" : "text-green-500"}`}>
          {isPropagandistic ? "Propagandistic" : "Not Propagandistic"}
        </span>
      </div>
    </div>
  );
};

export default ContentMetrics;
