"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Face from "@/components/Face";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import DiceHelpModal from "./DiceHelpModal";

interface DiceCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDiceRow: string | null;
  diceFaces: (number | null)[]; // Array of 6 numbers representing face type IDs
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  };
  pokemonInfo: any;
  faceTypesList: any[]; // Available face types from API
  onSave: (updatedFaces: (number | null)[]) => void;
}

export default function DiceCustomizationModal({
  isOpen,
  onClose,
  selectedDiceRow,
  diceFaces,
  diceData,
  pokemonInfo,
  faceTypesList = [],
  onSave,
}: DiceCustomizationModalProps) {

  const {t} = useTranslation();
  // Current 6 faces being edited
  const [tempFaces, setTempFaces] = useState<(number | null)[]>([]);
  // Currently selected face index (0-5 matching tempFaces)
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(0);

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Initialize state
  useEffect(() => {
    if (diceFaces && diceFaces.length === 6) {
      setTempFaces([...diceFaces]);
    } else {
      setTempFaces([0, 0, 0, 0, 0, 0]);
    }
    setActiveFaceIndex(0);
  }, [diceFaces, isOpen]);

  if (!isOpen) return null;

  const rowName =
    selectedDiceRow === "dice1"
      ? "Dice A"
      : selectedDiceRow === "dice2"
        ? "Dice B"
        : "Dice C";

  // Slot positions ordered by die face layout:
  // Face 1 (top) ← Fixed, Face 3 (top-left), Face 4 (top-right),
  // Face 2 (bottom) ← Fixed, Face 5 (bottom-left), Face 6 (bottom-right)
  //
  // faceIndex = which index in tempFaces this slot represents
  // Faces 1 & 2 → tempFaces[0] & tempFaces[1] (Fixed)
  // Faces 3-6   → tempFaces[2]-tempFaces[5]   (Available)
  const slotPositions = [
    {
      label: "1",
      faceIndex: 0,
      class: "top-[-22px] left-1/2 -translate-x-1/2",
    }, // Top     — Fixed
    { label: "3", faceIndex: 2, class: "top-[38px]  left-[-28px]" }, // Top-Left — Available
    { label: "4", faceIndex: 3, class: "top-[38px]  right-[-28px]" }, // Top-Right — Available
    {
      label: "2",
      faceIndex: 1,
      class: "bottom-[-22px] left-1/2 -translate-x-1/2",
    }, // Bottom — Fixed
    { label: "5", faceIndex: 4, class: "bottom-[38px] left-[-28px]" }, // Bottom-Left — Available
    { label: "6", faceIndex: 5, class: "bottom-[38px] right-[-28px]" }, // Bottom-Right — Available
  ];

  // Helper to map face type ID → props for <Face />
  const getFaceInfo = (faceTypeId: number | null) => {
    const faceType = faceTypesList?.find((ft) => ft.faceTypesId === faceTypeId);
    if (!faceType || !faceType.types || faceType.types.length === 0) {
      return { name1: "Normal", imageUrl1: "/img/Type/11.png", mixed: false };
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

  // Slots 0 & 1 are Fixed; slots 2-5 are Available
  const isActiveSlotFixed = activeFaceIndex < 2;

  // Remaining quantity for a face type, accounting for all 3 dice
  const getRemainingQty = (choiceFaceTypeId: number) => {
    if (isActiveSlotFixed) {
      const limit =
        pokemonInfo?.fixedFaces?.find(
          (f: any) => f.faceTypeId === choiceFaceTypeId,
        )?.quantity || 0;
      let used = 0;
      const otherRows = (["dice1", "dice2", "dice3"] as const).filter(
        (row) => row !== selectedDiceRow,
      );
      otherRows.forEach((row) => {
        const faces = diceData[row] || [];
        if (faces[0] === choiceFaceTypeId) used++;
        if (faces[1] === choiceFaceTypeId) used++;
      });
      if (tempFaces[0] === choiceFaceTypeId) used++;
      if (tempFaces[1] === choiceFaceTypeId) used++;
      return Math.max(0, limit - used);
    } else {
      const limit =
        pokemonInfo?.availableFaces?.find(
          (f: any) => f.faceTypeId === choiceFaceTypeId,
        )?.quantity || 0;
      let used = 0;
      const otherRows = (["dice1", "dice2", "dice3"] as const).filter(
        (row) => row !== selectedDiceRow,
      );
      otherRows.forEach((row) => {
        const faces = diceData[row] || [];
        for (let i = 2; i < 6; i++) {
          if (faces[i] === choiceFaceTypeId) used++;
        }
      });
      for (let i = 2; i < 6; i++) {
        if (tempFaces[i] === choiceFaceTypeId) used++;
      }
      return Math.max(0, limit - used);
    }
  };

  // Pool of choices shown on the right panel
  const baseChoices = isActiveSlotFixed
    ? pokemonInfo?.fixedFaces || []
    : pokemonInfo?.availableFaces || [];

  // Expand choices based on remaining quantity of each face type
  const choices: any[] = [];
  baseChoices.forEach((choice: any) => {
    const qty = getRemainingQty(choice.faceTypeId);
    for (let i = 0; i < qty; i++) {
      choices.push(choice);
    }
  });

  // Pad grid to 16 cells
  const totalGridSlots = 16;
  const gridElements = [...choices];
  while (gridElements.length < totalGridSlots) gridElements.push(null);

  const handleSelectElement = (faceTypeId: number) => {
    const updated = [...tempFaces];
    updated[activeFaceIndex] = faceTypeId;
    setTempFaces(updated);

    // Auto-advance within the same pool:
    // Fixed: 0→1, then jump to available; Available: 2→3→4→5
    if (isActiveSlotFixed) {
      if (activeFaceIndex < 1) setActiveFaceIndex(activeFaceIndex + 1);
      else setActiveFaceIndex(2);
    } else {
      if (activeFaceIndex < 5) setActiveFaceIndex(activeFaceIndex + 1);
    }
  };

  const handleRemoveElement = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...tempFaces];
    updated[index] = 0;
    setTempFaces(updated);
  };

  const handleClear = () => {
    setTempFaces([0, 0, 0, 0, 0, 0]);
    setActiveFaceIndex(0);
  };

  const handleSave = () => {
    const finalized = tempFaces.map((f) => (f === 0 || f === null ? null : f));
    onSave(finalized as any);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-black/50 text-white p-10 max-w-3xl w-full max-h-[85vh] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative font-salsa flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between rounded-2xl relative">
          <div className="flex items-center gap-3 pl-4">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/Dice.png"
                alt="Dice"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-wider">
                {t("diceCuztomization.title")}
              </h2>
              <p className="text-lg text-gray-400">
                {t("diceCuztomization.description", {rowName: `${rowName}`})}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white cursor-pointer hover:scale-110 transition-transform text-2xl pr-2 duration-150 text-bold"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="bg-white/70 h-0.5 w-[90%] self-center" />

        {/* Body cube + selector */}
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-64 py-2">
          {/* Left Die image with 6 slots positioned around it */}
          <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
            {/* Dice.png as the die visual */}
            <div className="relative z-10 w-30 h-30">
              <Image
                src="/Dice.png"
                alt="Dice"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              />
            </div>

            {/* 6 face slots in die-face order 1(top), 3, 4, 2(bottom), 5, 6 */}
            {slotPositions.map((pos) => {
              const { faceIndex, label } = pos;
              const faceTypeId = tempFaces[faceIndex];
              const isSelected = activeFaceIndex === faceIndex;
              const isFixed = faceIndex < 2;
              const faceInfo =
                faceTypeId && faceTypeId !== 0 ? getFaceInfo(faceTypeId) : null;

              return (
                <button
                  key={faceIndex}
                  onClick={() => setActiveFaceIndex(faceIndex)}
                  type="button"
                  title={`Face ${label} (${isFixed ? "Fixed" : "Available"})`}
                  className={`absolute z-20 w-14 h-14 rounded-md flex items-center justify-center border-2 transition-all duration-150 ${
                    isSelected ? "border-white" : "border-white/0"
                  } ${pos.class}`}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center rounded-xl ${isFixed ? "bg-[#E6C261]/70" : "bg-[#D9D9D9]/70"}`}
                  >
                    {faceInfo ? (
                      <Face
                        imageUrl1={faceInfo.imageUrl1}
                        name1={faceInfo.name1}
                        imageUrl2={faceInfo.imageUrl2}
                        name2={faceInfo.name2}
                        mixed={faceInfo.mixed}
                        className="w-[75%] h-[75%] border-none p-2"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="w-5.5 h-5.5"
                      >
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            fill="#000000"
                            fillRule="evenodd"
                            d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm14 .069a1 1 0 01-1 1h-2.931V14a1 1 0 11-2 0v-2.931H6a1 1 0 110-2h3.069V6a1 1 0 112 0v3.069H14a1 1 0 011 1z"
                          ></path>{" "}
                        </g>
                      </svg>
                    )}
                  </div>

                  {/* Clear badge */}
                  {faceInfo && (
                    <span
                      onClick={(e) => handleRemoveElement(faceIndex, e)}
                      role="button"
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-[8px] hover:bg-red-600 transition shadow z-30 cursor-pointer"
                      title="Clear slot"
                    >
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Selector grid */}
          <div className="bg-linear-to-b from-black/70 to-white/50 p-4 rounded-3xl m-1 w-fit shrink-0 relative">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="absolute top-3 right-3 w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/80 hover:scale-110 transition-transform z-40 shadow-md cursor-pointer"
              title="Help"
            >
              <span className="text-white font-bold text-xs leading-none">?</span>
            </button>
            <div className="grid grid-cols-4 gap-4 pt-6">
              {gridElements.map((choice, idx) => {
                if (!choice) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="bg-[#D9D9D9] rounded-xl w-15 h-15 drop-shadow-md/20"
                    />
                  );
                }

                const faceTypeId = choice.faceTypeId;
                const faceInfo = getFaceInfo(faceTypeId);

                return (
                  <button
                    key={`choice-${faceTypeId}-${idx}`}
                    onClick={() => handleSelectElement(faceTypeId)}
                    type="button"
                    title={
                      faceInfo.name1 +
                      (faceInfo.name2 ? ` / ${faceInfo.name2}` : "")
                    }
                    className="bg-[#D9D9D9] p-1.5 rounded-2xl flex items-center justify-center transition-all border-none hover:scale-105 cursor-pointer w-15 h-15 drop-shadow-md/20"
                  >
                    <Face
                      imageUrl1={faceInfo.imageUrl1}
                      name1={faceInfo.name1}
                      imageUrl2={faceInfo.imageUrl2}
                      name2={faceInfo.name2}
                      mixed={faceInfo.mixed}
                      className="w-full h-full border-none p-1"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <Button
            func={handleClear}
            text={t("button.clear")}
            className="text-black font-bold bg-yellow-200 hover:bg-yellow-300"
          />
          <Button
            func={handleSave}
            text={t("button.save")}
            className="text-black font-bold bg-yellow-300 hover:bg-yellow-400"
          />
        </div>
      </div>
      <DiceHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
