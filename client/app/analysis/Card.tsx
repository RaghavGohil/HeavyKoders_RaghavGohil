"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-transparent border border-gray-700 rounded-xl p-4 transition-all duration-200 hover:scale-105 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
