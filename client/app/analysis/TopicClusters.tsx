"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TopicClustersProps {
  data: any[];
}

const TopicClusters: React.FC<TopicClustersProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    
    d3.select(svgRef.current).selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    const height = 300;
    
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");
    
    // Pack layout setup
    const root = d3.hierarchy({ children: data })
      .sum((d: any) => d.value);
    
    const pack = d3.pack()
      .size([width, height])
      .padding(3);
    
    const nodes = pack(root).descendants().slice(1);
    
    // Create gradient definitions
    const defs = svg.append("defs");
    
    const colorRanges = [
      { id: "politics", colors: ["#f43f5e", "#e11d48"] },
      { id: "health", colors: ["#10b981", "#059669"] },
      { id: "environment", colors: ["#06b6d4", "#0891b2"] },
      { id: "economy", colors: ["#f59e0b", "#d97706"] },
      { id: "technology", colors: ["#8b5cf6", "#7c3aed"] },
      { id: "other", colors: ["#64748b", "#475569"] }
    ];
    
    colorRanges.forEach(range => {
      const gradient = defs.append("radialGradient")
        .attr("id", `${range.id}Gradient`);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", range.colors[0]);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", range.colors[1]);
    });
    
    const node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);
    
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => `url(#${d.data.category}Gradient)`)
      .attr("opacity", 0.9)
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);
    
    node.filter(d => d.r > 20)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", d => d.r / 5)
      .attr("fill", "#fff")
      .text(d => d.data.name);
    
    node.append("title")
      .text(d => `${d.data.name}\nCategory: ${d.data.category}\nValue: ${d.data.value}`);
    
  }, [data]);
  
  return <svg ref={svgRef} width="100%" height="300px" />;
};

export default TopicClusters;
