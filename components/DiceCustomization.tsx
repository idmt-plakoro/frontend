import React from "react";
import DiceDisplayRow from "./DiceDisplayRow";
import { useTranslation } from "react-i18next";

interface DiceCustomizationProps {
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  };
  firstTurn: boolean;
  banDice: { row: string; index: number };
  setBanDice: React.Dispatch<React.SetStateAction<{ row: string; index: number }>>;
  faceTypesList: any[];
  onEditClick: (rowName: string) => void;
}

export default function DiceCustomization({
  diceData,
  firstTurn,
  banDice,
  setBanDice,
  faceTypesList,
  onEditClick,
}: DiceCustomizationProps) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 min-h-37.5 bg-[#1e1e1e] text-white rounded-xl p-4 flex flex-col justify-between">
      <div className="w-full mb-4">
        <div className="flex items-center gap-3 mb-2">
          {/* ไอคอนสี่เหลี่ยมในวงกลมสีเหลือง */}
          <div className="w-9 h-9 rounded-full border-[3px] border-yellow-400 bg-[#1e1e1e] flex items-center justify-center shrink-0 shadow-md">
            {/* ตัวกล่องลูกบาศก์ 3 มิติ (Isometric Cube SVG) */}
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-neutral-400"
              fill="currentColor"
            >
              {/* ด้านบนของลูกบาศก์ (Top Face) - สีเทาอ่อน */}
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                fill="#b3b3b3"
                stroke="#1a1a1a"
                strokeWidth="1"
              />
              {/* ด้านซ้าย (Left Face) - สีเทากลาง */}
              <path
                d="M2 7v10l10 5V12L2 7z"
                fill="#8c8c8c"
                stroke="#1a1a1a"
                strokeWidth="1"
              />
              {/* ด้านขวา (Right Face) - สีเทาเข้ม */}
              <path
                d="M12 12v10l10-5V7L12 12z"
                fill="#666666"
                stroke="#1a1a1a"
                strokeWidth="1"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black tracking-wide italic">
            {t("title.diceCuztomization")}
          </h3>
        </div>
        <div className="h-0.5 bg-white w-full opacity-90"></div>
      </div>

      {/* 🛠️ ส่วนแสดงผลลูกเต๋า 3 แถว พร้อมส่ง Props ส่องสถานะเปิด Ban คัดกรองตามเงื่อนไข */}
      <div className="flex flex-col gap-3">
        {["dice1", "dice2", "dice3"].map((rowKey, rowIndex) => {
          const currentFaces =
            diceData[rowKey as "dice1" | "dice2" | "dice3"];
          return (
            <div
              key={rowKey}
              className="relative flex items-center w-full"
            >
              <DiceDisplayRow
                rowLabel={`Dice ${String.fromCharCode(65 + rowIndex)}`}
                diceFaces={currentFaces}
                onEditClick={() => onEditClick(rowKey)}
                faceTypesList={faceTypesList}
                isFaded={firstTurn && banDice.row === rowKey}
                isFirstTurn={firstTurn}
                onBanClick={() => setBanDice({ row: rowKey, index: 0 })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
