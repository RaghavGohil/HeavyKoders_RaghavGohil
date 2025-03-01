"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface NetworkData {
  nodes: any[];
  links: any[];
}

interface NetworkGraphProps {
  data: NetworkData;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    const height = 300;
    
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");
    
    // Create simulation with forces
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(70))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));
    
    // Define gradients for node types
    const defs = svg.append("defs");
    const gradients = [
      { id: "sourceGradient", colors: [{ offset: "0%", color: "#f97316" }, { offset: "100%", color: "#ea580c" }] },
      { id: "amplifierGradient", colors: [{ offset: "0%", color: "#8b5cf6" }, { offset: "100%", color: "#7c3aed" }] },
      { id: "consumerGradient", colors: [{ offset: "0%", color: "#06b6d4" }, { offset: "100%", color: "#0891b2" }] }
    ];
    
    gradients.forEach(gradient => {
      const gradientDef = defs.append("linearGradient")
        .attr("id", gradient.id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");
      
      gradient.colors.forEach(stop => {
        gradientDef.append("stop")
          .attr("offset", stop.offset)
          .attr("stop-color", stop.color);
      });
    });
    
    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-opacity", 0.6);
    
    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g");
    
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => {
        if (d.type === "source") return "url(#sourceGradient)";
        if (d.type === "amplifier") return "url(#amplifierGradient)";
        return "url(#consumerGradient)";
      })
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);
    
    node.append("text")
      .attr("dx", d => d.size + 5)
      .attr("dy", ".35em")
      .attr("font-size", "10px")
      .attr("fill", "#cbd5e1")
      .text(d => d.name);
    
    node.append("title")
      .text(d => `${d.name}\nType: ${d.type}\nReach: ${d.reach}`);
    
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });
    
    svg.call(zoom as any);
    
  }, [data]);
  
  return <svg ref={svgRef} width="100%" height="300px" />;
};

export default NetworkGraph;
