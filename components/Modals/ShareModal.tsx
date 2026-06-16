"use client";

import React, { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen font-salsa select-none">
      {/* Semi-transparent black backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-[#333333]/90 w-[90%] max-w-[70%] p-6 pb-8 rounded-2xl border border-[#fdd835] z-10 flex flex-col items-center">
        {/* Close Button 'X' */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#fdd835] transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Spacing for layout */}
        <div className="h-4" />

        {/* White Pill Container */}
        <div className="w-full flex items-center justify-between bg-white rounded-full p-1 border-2 border-white shadow-md">
          {/* URL Badge */}
          <div className="bg-[#1a1a1a] text-white text-[11px] md:text-xs font-black tracking-wider px-5 py-2.5 rounded-full select-none shrink-0 min-w-17.5 text-center uppercase drop-shadow-md/20">
            URL
          </div>

          {/* URL text display */}
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent grow-black text-xs md:text-sm font-sans font-medium px-4 outline-none select-all truncate w-full"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="bg-[#1a1a1a] text-white hover:bg-neutral-800 active:scale-95 text-[11px] md:text-xs font-black tracking-wider px-6 py-2.5 rounded-full transition-all shrink-0 min-w-20 text-center uppercase cursor-pointer drop-shadow-md/20"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
