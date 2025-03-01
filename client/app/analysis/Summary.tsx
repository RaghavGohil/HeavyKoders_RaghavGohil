"use client";

import React from "react";

interface SummaryProps {
  title: string;
  children: React.ReactNode;
}

const Summary: React.FC<SummaryProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="text-gray-400 text-base">
        {children}
      </div>
    </div>
  );
};

export default Summary;
