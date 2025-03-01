"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: string;
  value: number;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData = data.map(d => ({
      date: new Date(d.date),
      value: d.value
    }));

    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, width]);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.value) as number])
      .range([height, 0]);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#94a3b8")
      .attr("font-size", "10px");

    // Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#94a3b8")
      .attr("font-size", "10px");

    // Gradient definition for area
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#6366f1")
      .attr("stop-opacity", 0.6);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6366f1")
      .attr("stop-opacity", 0);

    // Area generator
    const area = d3.area<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const pathArea = svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area)
      .attr("opacity", 0);

    // Fade in the area
    pathArea.transition()
      .duration(2000)
      .attr("opacity", 1);

    // Line generator
    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const pathLine = svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#818cf8")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate the line using stroke-dash
    const totalLength = (pathLine.node() as SVGPathElement).getTotalLength();
    pathLine
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Animate dots
    svg.selectAll(".dot")
      .data(parsedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.value))
      .attr("r", 0) // start with radius 0
      .attr("fill", "#818cf8")
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 3);

  }, [data]);

  return <svg ref={svgRef} width="100%" height="200px" />;
};

export default TimeSeriesChart;
