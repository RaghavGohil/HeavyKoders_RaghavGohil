"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface LinkItem {
  text: string;
  url: string;
}

interface WordCloudItem {
  text: string;
  frequency: number;
}

interface RelatedLinksWordCloudProps {
  relatedLinks: LinkItem[];
  wordCloudData: WordCloudItem[];
}

const RelatedLinksWordCloud: React.FC<RelatedLinksWordCloudProps> = ({
  relatedLinks,
  wordCloudData,
}) => {
  const wordCloudSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!wordCloudSvgRef.current) return;

    // Clear previous word cloud
    d3.select(wordCloudSvgRef.current).selectAll("*").remove();

    const width = 300;
    const height = 300;
    const svg = d3
      .select(wordCloudSvgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    // Scale font size based on frequency
    const fontSizeScale = d3
      .scaleLinear()
      .domain([
        d3.min(wordCloudData, d => d.frequency)!,
        d3.max(wordCloudData, d => d.frequency)!,
      ])
      .range([12, 36]);

    // Create nodes for simulation with initial random positions
    const nodes = wordCloudData.map(d => ({
      text: d.text,
      frequency: d.frequency,
      fontSize: fontSizeScale(d.frequency),
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    // Use a force simulation to arrange words
    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collision", d3.forceCollide((d: any) => d.fontSize + 5))
      .stop();

    // Run the simulation for a fixed number of iterations
    for (let i = 0; i < 100; ++i) simulation.tick();

    // Append words to the SVG
    const texts = svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", d => d.fontSize)
      .attr("fill", "#818cf8")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .text(d => d.text);

    // Append a tooltip to each text element for frequency info
    texts.append("title").text(d => `Frequency: ${d.frequency}`);
  }, [wordCloudData]);

  return (
    <div className="flex">
      {/* Related Links Section */}
      <div className="flex-1 mr-4">
        <h2 className="text-2xl font-bold text-white mb-2">Related Sources</h2>
        {relatedLinks.length > 0 ? (
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
        <svg ref={wordCloudSvgRef} className="mx-auto" />
      </div>
    </div>
  );
};

export default RelatedLinksWordCloud;
