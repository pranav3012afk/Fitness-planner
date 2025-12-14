
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.93 13.5A6.5 6.5 0 0 1 3.43 7 4.5 4.5 0 0 1 7 3.43 6.5 6.5 0 0 1 13.5 9.93l.07.07" />
    <path d="M14 10l.07.07" />
    <path d="M10 14l.07.07" />
    <path d="m21 21-6.5-6.5" />
    <path d="M18 11.5a4.5 4.5 0 0 1-6.07 6.07A4.5 4.5 0 0 1 11.93 18" />
    <path d="M17 3v4" />
    <path d="M19 5h-4" />
    <path d="M3 17v4" />
    <path d="M5 19H1" />
  </svg>
);
   