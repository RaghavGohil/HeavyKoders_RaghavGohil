"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

interface LinkItem {
  text: string;
  url: string;
}

interface WordCloudItem {
  text: string;
  frequency: number;
}

interface RelatedLinksWordCloudProps {
  query: string;
}

const RelatedLinksWordCloud: React.FC<RelatedLinksWordCloudProps> = ({ query }) => {
  const [relatedLinks, setRelatedLinks] = useState<LinkItem[]>([]);
  const [wordCloudData, setWordCloudData] = useState<WordCloudItem[]>([]);
  const [linksLoading, setLinksLoading] = useState<boolean>(false);
  const [wordCloudLoading, setWordCloudLoading] = useState<boolean>(false);
  const wordCloudSvgRef = useRef<SVGSVGElement>(null);

  // Fetch related sources when the query changes.
  useEffect(() => {
    if (query) {
      setLinksLoading(true);
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/related_sources",
          { query },
          { withCredentials: true }
        )
        .then((res) => {
          // Ensure we have an array or fallback to empty.
          setRelatedLinks(res.data.sources || []);
        })
        .catch((err) => {
          console.error("Error fetching related sources:", err);
          setRelatedLinks([]);
        })
        .finally(() => {
          setLinksLoading(false);
        });
    }
  }, [query]);

  // Fetch word cloud data when the query changes.
  useEffect(() => {
    if (query) {
      setWordCloudLoading(true);
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/wordcloud",
          { query },
          { withCredentials: true }
        )
        .then((res) => {
          setWordCloudData(res.data.wordcloud || []);
        })
        .catch((err) => {
          console.error("Error fetching word cloud data:", err);
          setWordCloudData([]);
        })
        .finally(() => {
          setWordCloudLoading(false);
        });
    }
  }, [query]);

  // Render the word cloud using D3.
  useEffect(() => {
    if (!wordCloudSvgRef.current) return;

    // Clear previous word cloud.
    d3.select(wordCloudSvgRef.current).selectAll("*").remove();

    // If there's no word cloud data, show a message.
    if (wordCloudData.length === 0) {
      d3.select(wordCloudSvgRef.current)
        .append("text")
        .attr("x", 150)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", "#818cf8")
        .text("No related words found.");
      return;
    }

    const width = 300;
    const height = 300;
    const svg = d3
      .select(wordCloudSvgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    // Scale font size based on frequency.
    const fontSizeScale = d3
      .scaleLinear()
      .domain([
        d3.min(wordCloudData, (d) => d.frequency)!,
        d3.max(wordCloudData, (d) => d.frequency)!,
      ])
      .range([12, 36]);

    // Create nodes with initial random positions.
    const nodes = wordCloudData.map((d) => ({
      text: d.text,
      frequency: d.frequency,
      fontSize: fontSizeScale(d.frequency),
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    // Use a force simulation to arrange words.
    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collision", d3.forceCollide((d: any) => d.fontSize + 5))
      .stop();

    // Run the simulation.
    for (let i = 0; i < 100; ++i) simulation.tick();

    // Append words.
    const texts = svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", (d) => d.fontSize)
      .attr("fill", "#818cf8")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .text((d) => d.text);

    // Add tooltips.
    texts.append("title").text((d) => `Frequency: ${d.frequency}`);
  }, [wordCloudData]);

  return (
    <div className="flex">
      {/* Related Links Section */}
      <div className="flex-1 mr-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          Related Sources From Reddit
        </h2>
        {linksLoading ? (
          <p className="text-gray-400">Loading related links...</p>
        ) : relatedLinks.length > 0 ? (
          <ul className="list-disc list-inside text-gray-400">
            {relatedLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No related links available.</p>
        )}
      </div>

      {/* Word Cloud Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-2">Related Words</h2>
        {wordCloudLoading ? (
          <p className="text-gray-400">Loading word cloud...</p>
        ) : (
          <svg ref={wordCloudSvgRef} className="mx-auto" />
        )}
      </div>
    </div>
  );
};

export default RelatedLinksWordCloud;
