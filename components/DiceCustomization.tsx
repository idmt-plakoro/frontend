import React from "react";
import DiceDisplayRow from "./DiceDisplayRow";
import { useTranslation } from "react-i18next";
import Image from "next/image";


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
    <div className="w-full md:flex-1 min-h-37.5 bg-[#1e1e1e] text-white rounded-xl p-4 flex flex-col justify-between">
      <div className="w-full mb-4">
        <div className="flex items-center gap-3 mb-2">
          {/* ไอคอนสี่เหลี่ยมในวงกลมสีเหลือง */}
          <div className="w-9 h-9 rounded-full border-[3px] border-yellow-400 bg-[#1e1e1e] flex items-center justify-center shrink-0 shadow-md">
            <Image
                src="/Dice.png"
                alt="Dice"
                width={25}
                height={25}
                className="pl-[1px] pt-[1px] object-contain"
              />
          </div>
          <h3 className="text-2xl font-black tracking-wide italic">
            {t("diceCuztomization.title")}
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
