"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-slate-800/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
