"use client";

import React from "react";

export default function DiceBackground() {
  return (
    <div className="fixed w-[240vw] h-[240vh] -top-[50vh] -left-[57vw] rotate-45 z-0 overflow-hidden pointer-events-none opacity-75">
      <div
        className="w-full h-full grid justify-center content-center"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gridAutoRows: "140px",
          gap: "20px",
          padding: "20px",
        }}
      >
        {Array.from({ length: 260 }).map((_, index) => {
          // Deterministic pseudo-random rotation for each dice
          const rotation = (index * 41) % 360;
          return (
            <div key={index} className="flex justify-center items-center">
              <img
                src="/backgound-dice.png"
                alt=""
                className="object-contain select-none"
                style={{
                  width: "140px",
                  height: "140px",
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
