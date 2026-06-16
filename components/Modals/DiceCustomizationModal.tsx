"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Face from "@/components/Face";

interface DiceCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDiceRow: string | null;
  diceFaces: number[]; // Array of 6 numbers representing face type IDs
  diceData: {
    dice1: number[];
    dice2: number[];
    dice3: number[];
  };
  pokemonInfo: any;
  faceTypesList: any[]; // Available face types from API
  onSave: (updatedFaces: number[]) => void;
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
  // Current 6 faces being edited
  const [tempFaces, setTempFaces] = useState<number[]>([]);
  // Currently selected face index (0-5 matching tempFaces)
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(0);

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
    { label: "3", faceIndex: 2, class: "top-[38px]  left-[-32px]" }, // Top-Left — Available
    { label: "4", faceIndex: 3, class: "top-[38px]  right-[-32px]" }, // Top-Right — Available
    {
      label: "2",
      faceIndex: 1,
      class: "bottom-[-22px] left-1/2 -translate-x-1/2",
    }, // Bottom — Fixed
    { label: "5", faceIndex: 4, class: "bottom-[38px] left-[-32px]" }, // Bottom-Left — Available
    { label: "6", faceIndex: 5, class: "bottom-[38px] right-[-32px]" }, // Bottom-Right — Available
  ];

  // Helper to map face type ID → props for <Face />
  const getFaceInfo = (faceTypeId: number) => {
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

  // Pool of choices shown on the right panel
  const choices = isActiveSlotFixed
    ? pokemonInfo?.fixedFaces || []
    : pokemonInfo?.availableFaces || [];

  // Pad grid to 16 cells
  const totalGridSlots = 16;
  const gridElements = [...choices];
  while (gridElements.length < totalGridSlots) gridElements.push(null);

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
      const otherFixed = activeFaceIndex === 0 ? 1 : 0;
      if (tempFaces[otherFixed] === choiceFaceTypeId) used++;
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
        if (i !== activeFaceIndex && tempFaces[i] === choiceFaceTypeId) used++;
      }
      return Math.max(0, limit - used);
    }
  };

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
    const defaultFaceTypeId = pokemonInfo?.availableFaces?.[0]?.faceTypeId || 1;
    const finalized = tempFaces.map((f) => (f === 0 ? defaultFaceTypeId : f));
    onSave(finalized);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1e1e1e] text-white p-6 rounded-3xl max-w-3xl w-full max-h-[85vh] border-4 border-yellow-400 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative font-salsa flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-2 border-yellow-400 bg-black/40 rounded-2xl p-4 relative">
          <div className="flex items-center gap-3 pl-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/40 bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/DIce.png"
                alt="Dice"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-yellow-400 tracking-wider">
                Dice Customization
              </h2>
              <p className="text-xs text-gray-400">
                Select 6 elements from the list ({rowName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white font-black text-2xl pr-2 transition-colors duration-150"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body: cube + selector */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center min-h-64 py-2">
          {/* Left — Die image with 6 slots positioned around it */}
          <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
            {/* DIce.png as the die visual */}
            <div className="relative z-10 w-44 h-44">
              <Image
                src="/Dice.png"
                alt="Dice"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
              />
            </div>

            {/* 6 face slots in die-face order: 1(top), 3, 4, 2(bottom), 5, 6 */}
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
                  className={`absolute z-20 w-12 h-12 rounded-xl flex items-center justify-center border-4 transition-all duration-150 ${
                    isSelected
                      ? "border-yellow-400 scale-110 bg-yellow-400/20 shadow-[0_0_16px_rgba(250,204,21,0.7)]"
                      : isFixed
                        ? "border-yellow-600/60 bg-neutral-800 hover:border-yellow-500 hover:bg-neutral-700 shadow-md"
                        : "border-neutral-700 bg-neutral-700/80 hover:bg-neutral-600 shadow-lg"
                  } ${pos.class}`}
                >
                  {faceInfo ? (
                    <Face
                      imageUrl1={faceInfo.imageUrl1}
                      name1={faceInfo.name1}
                      imageUrl2={faceInfo.imageUrl2}
                      name2={faceInfo.name2}
                      mixed={faceInfo.mixed}
                      className="w-full h-full border-none p-1"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white/40">+</span>
                  )}

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

                  {/* Face label */}
                  <span
                    className={`absolute -bottom-5 text-[8px] font-black tracking-wide px-1 py-0.5 rounded border uppercase ${
                      isFixed
                        ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                        : "text-neutral-300 bg-neutral-900/90 border-white/10"
                    }`}
                  >
                    {isFixed ? `FIX ${label}` : `AVL ${label}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right — Selector grid */}
          <div className="flex-1 bg-neutral-800/50 border border-white/5 p-4 rounded-3xl w-full max-w-sm">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 pl-1">
              Select{" "}
              <span
                className={
                  isActiveSlotFixed ? "text-yellow-400" : "text-blue-400"
                }
              >
                {isActiveSlotFixed ? "Fixed" : "Available"}
              </span>{" "}
              Face — Slot {activeFaceIndex + 1}:
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {gridElements.map((choice, idx) => {
                if (!choice) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="aspect-square bg-neutral-700/20 border border-neutral-700/40 rounded-xl"
                    />
                  );
                }

                const faceTypeId = choice.faceTypeId;
                const remainingQty = getRemainingQty(faceTypeId);
                const isSelectable = remainingQty > 0;
                const faceInfo = getFaceInfo(faceTypeId);

                return (
                  <div key={faceTypeId} className="relative aspect-square">
                    <button
                      onClick={() =>
                        isSelectable && handleSelectElement(faceTypeId)
                      }
                      disabled={!isSelectable}
                      type="button"
                      title={
                        faceInfo.name1 +
                        (faceInfo.name2 ? ` / ${faceInfo.name2}` : "")
                      }
                      className={`w-full h-full border-2 p-1 rounded-xl flex flex-col items-center justify-between transition-all bg-neutral-800 ${
                        isSelectable
                          ? "border-neutral-700 hover:border-yellow-400 hover:scale-105 cursor-pointer"
                          : "border-neutral-900 opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <Face
                        imageUrl1={faceInfo.imageUrl1}
                        name1={faceInfo.name1}
                        imageUrl2={faceInfo.imageUrl2}
                        name2={faceInfo.name2}
                        mixed={faceInfo.mixed}
                        className="w-full h-10 border-none rounded-lg"
                      />
                      <span className="text-[9px] font-black truncate w-full text-center mt-1 text-white">
                        Qty: {remainingQty}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={handleClear}
            type="button"
            className="px-6 py-2.5 bg-neutral-700 text-white rounded-xl font-bold border-2 border-neutral-600 hover:bg-neutral-600 transition shadow-md active:scale-95 text-sm uppercase"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="px-8 py-2.5 bg-yellow-400 text-black rounded-xl font-bold border-2 border-black hover:bg-yellow-500 transition shadow-md active:scale-95 text-sm uppercase"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
