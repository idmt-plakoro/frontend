import React from "react";
import Image from "next/image";
import Face from "./Face";

interface DiceDisplayRowProps {
  diceFaces: (number | null)[]; // Array ตัวเลขหรือ null 6 ตำแหน่ง เช่น [1, 2, 2, 3, 4, 1]
  onEditClick: () => void; // ฟังก์ชันที่จะทำงานเมื่อกดปุ่มเปิด Modal
  rowLabel?: string; // ป้ายกำกับแถว (เผื่ออยากใส่เช่น Dice 1, Dice 2)
  faceTypesList?: any[]; // ข้อมูลประเภทหน้าเต๋า
  isFaded?: boolean;
  isFirstTurn?: boolean;
  onBanClick?: () => void;
}

export default function DiceDisplayRow({
  diceFaces,
  onEditClick,
  rowLabel,
  faceTypesList = [],
  isFaded = false,
  isFirstTurn = false,
  onBanClick,
}: DiceDisplayRowProps) {
  const getFaceInfo = (faceTypeId: number | null) => {
    const faceType = faceTypesList?.find((ft) => ft.faceTypesId === faceTypeId);
    if (!faceType || !faceType.types || faceType.types.length === 0) {
      return {
        name1: "Normal",
        imageUrl1: "/img/Type/11.png",
        mixed: false,
      };
    }
    if (faceType.types.length === 1) {
      return {
        name1: faceType.types[0].enName || "Normal",
        imageUrl1:
          faceType.types[0].typeImage ||
          `/img/Type/${faceType.types[0].id}.png`,
        mixed: false,
      };
    }
    return {
      name1: faceType.types[0].enName || "Normal",
      imageUrl1:
        faceType.types[0].typeImage || `/img/Type/${faceType.types[0].id}.png`,
      name2: faceType.types[1].enName || "Normal",
      imageUrl2:
        faceType.types[1].typeImage || `/img/Type/${faceType.types[1].id}.png`,
      mixed: true,
    };
  };

  return (
    <div className="flex items-center gap-4 bg-transparent py-2 w-full">
      {/* 1. ปุ่มซ้ายสุดสำหรับเปิด Modal */}
      <button
        onClick={onEditClick}
        className="relative w-14 h-14 bg-white hover:bg-neutral-200 rounded-full flex items-center justify-center border-4 border-neutral-800 shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:scale-95 transition-all shrink-0 group"
        title="Edit Dice"
      >
        <div className="relative w-full h-full group-hover:scale-105 transition-transform">
          <Image
            src="/Dice.png"
            alt="Edit"
            fill
            className="object-contain p-2"
          />
        </div>
      </button>

      {/* เผื่ออยากแสดงชื่อแถวเล็กๆ */}
      {/* {rowLabel && (
        <span className="text-xs font-bold text-gray-400 min-w-[45px]">{rowLabel}</span>
      )} */}

      {/* 2. โซนแสดงผลธาตุ 6 ด้านจาก Array */}
      <div className="relative grow">
        <div
          className={`grid grid-cols-6 gap-1.5 transition-opacity duration-200 ${isFaded ? "opacity-30" : "opacity-100"}`}
        >
          {diceFaces.map((faceTypeId, index) => {
            if (faceTypeId === null || faceTypeId === 0) {
              return (
                <div
                  key={index}
                  className="w-full min-w-0 max-w-13.75 aspect-square bg-[#222]/30 border border-dashed border-white/20 rounded-md"
                />
              );
            }
            const faceInfo = getFaceInfo(faceTypeId);

            return (
              <Face
                key={index}
                imageUrl1={faceInfo.imageUrl1}
                name1={faceInfo.name1}
                imageUrl2={faceInfo.imageUrl2}
                name2={faceInfo.name2}
                mixed={faceInfo.mixed}
                className="w-full min-w-0 max-w-13.75 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-slate-100"
              />
            );
          })}
        </div>

        {/* Ban overlay */}
        {isFirstTurn && onBanClick && (
          <button
            onClick={onBanClick}
            className="border-none absolute inset-0 rounded-lg transition-all duration-200 pointer-events-auto flex items-center justify-center z-10"
            title="Click to ban this dice"
          ></button>
        )}
      </div>
    </div>
  );
}
