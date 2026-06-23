"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { typecolor, typeIcon } from "@/constants/TypeColor";
import { typeIdToName } from "@/constants/TypeIdToName";
import Face from "../Face";
import { directions } from "@/constants/directions";
import { SkillCard } from "../CardBox";
import { useTranslation } from "react-i18next";

// --- Interfaces & Enums ---
export enum Direction {
  Upright = "upright",
  FaceUp = "faceup",
  UpsideDown = "upsideDown",
  FaceDown = "facedown",
  LeftSide = "leftside",
  RightSide = "rightside",
}

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillCards: SkillCard[];
  oldSkillSave?: number[];
  onConfirm: (newSkillSave: number[]) => void;
}

export default function SkillModal({
  isOpen,
  onClose,
  skillCards = [],
  oldSkillSave = [],
  onConfirm,
}: SkillModalProps) {

  const {t,i18n} = useTranslation();

  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<SkillCard | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedSkills(Array.isArray(oldSkillSave) ? [...oldSkillSave] : []);
      setHoveredSkill(null);
    }
  }, [isOpen, oldSkillSave]);

  useEffect(() => {
    if (!hoveredSkill) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".skill-card-item") && !target.closest(".detail-panel")) {
        setHoveredSkill(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [hoveredSkill]);

  if (!isOpen) return null;

  const handleToggleSkill = (skillId: number) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) return prev.filter((id) => id !== skillId);
      if (prev.length < 5) return [...prev, skillId];
      return prev;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getLocalizedText = (
    enText?: string | null,
    thText?: string | null,
    fallback: string = ""
  ) => {
    if (i18n.language === "th") {
      return thText || enText || fallback;
    }
    return enText || thText || fallback;
  };

  const isSelectionComplete = selectedSkills.length === 5;

  return (
    <div className="fixed inset-0 bg-[black]/70 z-[100] flex items-center justify-center p-4 font-salsa">
      <div className="bg-[#040404]/80 text-white p-6 rounded-xl max-w-2xl w-full border border-zinc-800 shadow-2xl relative flex flex-col gap-4 h-[85vh] max-h-[750px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1e1e1e] border border-zinc-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-[40px] h-[40px]">
                  <g transform="translate(-2, 2)">
                    <path d="M30 32 L51 26 L74 33 L52 41 Z" fill="#EAEAEA" />
                    <path d="M52 41 L74 33 L73 58 L51 70 L51 40.5 Z" fill="#B2B2B2" />
                    <path d="M30 32 L52 41 L51 70 L32 60.2 L30 32.5 Z" fill="#CECECE" />
                  </g>
                </svg>
              </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide">{t("skill.modal.title")}</h2>
              <p className="text-xs font-medium text-zinc-500">
                {t("skill.modal.subtitle")} (
                <span
                  className={
                    isSelectionComplete
                      ? "text-green-400 font-bold"
                      : "text-yellow-400"
                  }
                >
                  {selectedSkills.length}
                </span>
                /5)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl p-1"
          >
            ✕
          </button>
        </div>

        {/* List Grid */}
        <div
          className="flex-1 overflow-y-auto bg-[#CDCDCD]/30 rounded-xl p-4 min-h-0 relative"
          onMouseMove={handleMouseMove}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skillCards.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  className="relative cursor-pointer group skill-card-item"
                  onClick={() => {
                    handleToggleSkill(skill.id);
                    if (isMobile) {
                      if (isSelected) {
                        if (hoveredSkill?.id === skill.id) {
                          setHoveredSkill(null);
                        }
                      } else {
                        setHoveredSkill(skill);
                      }
                    }
                  }}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div
                    className={`w-full aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all duration-150 bg-zinc-800 flex flex-col items-center justify-center p-3 relative ${
                      isSelected
                        ? "border-red-500 scale-95"
                        : "border-zinc-700 hover:border-yellow-500"
                    }`}
                  >
                    {skill.imageUrl ? (
                      <Image
                        src={skill.imageUrl}
                        alt={skill.name?.en || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center w-full h-full flex flex-col justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 rounded">
                        <p className="font-bold text-sm text-yellow-400 tracking-wide px-2 line-clamp-1">
                          {getLocalizedText(skill.name?.en, skill.name?.th, "Unknown")}
                        </p>
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <span className="w-3 h-[3px] bg-white rounded-full"></span>
                    </div>
                  )}

                  {isMobile && (
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center border border-zinc-600 z-20 shadow-md active:scale-90 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredSkill(skill);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5 text-zinc-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 111.083.985l-.04.02L11 16h1m1-8h.01"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => setSelectedSkills([])}
            className="px-8 py-2 bg-zinc-800 text-white font-black rounded-lg text-sm border border-zinc-700 hover:bg-zinc-700"
          >
            {t("button.clear")}
          </button>

          <button
            disabled={!isSelectionComplete}
            onClick={() => {
              if (isSelectionComplete) {
                onConfirm(selectedSkills);
                onClose();
              }
            }}
            className={`px-8 py-2 font-black rounded-lg text-sm transition-all duration-200 ${
              isSelectionComplete
                ? "bg-[#ffcc00] text-black hover:bg-yellow-400 cursor-pointer shadow-lg active:scale-95"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed opacity-50"
            }`}
          >
            {t("button.confirm")}
          </button>
        </div>
      </div>

      {/* Floating Panel (เมื่อ Hover บนการ์ดสกิล) */}
      {hoveredSkill &&
        (() => {
          const typeName =
            typeIdToName[hoveredSkill.typeId as keyof typeof typeIdToName] ||
            "Normal";
          const currentTypeColor =
            typecolor[typeName as keyof typeof typecolor] || "#ffffff";

          // ระบบคำนวณพื้นที่หน้าจอ Real-time ป้องกันกล่องข้อมูลตกจอ
          const isClient = typeof window !== "undefined";
          const screenWidth = isClient ? window.innerWidth : 1920;
          const screenHeight = isClient ? window.innerHeight : 1080;

          // เช็คว่าเมาส์อยู่ครึ่งล่างของจอ หรือชิดขอบขวาเกินไปหรือไม่
          const shouldFlipY = mousePos.y > screenHeight * 0.55;
          const shouldFlipX = mousePos.x > screenWidth - 360; // 360 คือขนาดความกว้างกล่อง + ระยะเผื่อปลอดภัย

          // กำหนดตำแหน่งพิกัดและ transform พลิกด้านกล่องข้อมูลอัตโนมัติ
          const topPosition = isMobile ? undefined : (shouldFlipY ? mousePos.y - 15 : mousePos.y + 15);
          const leftPosition = isMobile ? "16px" : (shouldFlipX ? mousePos.x - 15 : mousePos.x + 15);
          const rightPosition = isMobile ? "16px" : undefined;
          const bottomPosition = isMobile ? "16px" : undefined;
          const transformStyle = isMobile
            ? undefined
            : `${shouldFlipY ? "translateY(-100%)" : ""} ${shouldFlipX ? "translateX(-100%)" : ""}`.trim();

          return (
            <div
              className={`fixed z-[110] bg-[#040404]/95 backdrop-blur-md border border-zinc-700 p-4 shadow-2xl rounded-lg text-xs flex flex-col gap-2.5 text-zinc-200 detail-panel ${
                isMobile
                  ? "pointer-events-auto max-h-[35vh] overflow-y-auto"
                  : "pointer-events-none min-w-[280px] max-w-[340px] transition-transform duration-75"
              }`}
              style={{
                top: topPosition,
                left: leftPosition,
                right: rightPosition,
                bottom: bottomPosition,
                transform: transformStyle || undefined,
              }}
            >
              <h3 className="text-sm font-bold text-white border-b border-zinc-700 pb-1.5 pr-6 relative">
                {t("skill.skillName")} : {getLocalizedText(hoveredSkill.name?.en, hoveredSkill.name?.th, t("skill.modal.unknown"))}
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setHoveredSkill(null)}
                    className="absolute -top-1 right-0 text-zinc-400 hover:text-white text-base p-1"
                  >
                    ✕
                  </button>
                )}
              </h3>
              <p>
                <span className="text-zinc-400 font-medium">{t("pokemonInfo.element")} : </span>
                <span
                  className="font-bold uppercase tracking-wider"
                  style={{ color: currentTypeColor }}
                >
                  {t(`type.${typeName}`)}
                </span>
              </p>
              <p>
                <span className="text-zinc-400 font-medium">{t("pokemonInfo.damage")} : </span>
                <span className="text-white font-bold">
                  {hoveredSkill.damage} {t("pokemonInfo.unit")}{" "}
                </span>
              </p>

              {hoveredSkill.fightingAbility?.en ||
              hoveredSkill?.fightingAbility?.th ? (
                <p>
                  <span className="text-zinc-400 font-medium">{t("skill.ability")} : </span>
                  <span className="text-white font-bold">
                    {getLocalizedText(hoveredSkill.fightingAbility?.en, hoveredSkill.fightingAbility?.th)}
                  </span>
                </p>
              ) : null}

              {/* วนลูปแยกการแสดงผลตามก้อนบรรทัดของ Effect */}
              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-2">
                <span className="text-zinc-400 font-medium">
                  {t("skill.abilityEffect")} :
                </span>
                {hoveredSkill.effects?.map((eff, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/60 border border-zinc-800 p-2 rounded-md flex flex-col gap-1.5"
                  >
                    <div className="flex flex-wrap gap-1">
                      {eff.directions?.map((dir, i) => {
                        const matchedKey = Object.keys(directions).find(
                          (key) => key.toLowerCase() === dir.toLowerCase(),
                        );
                        const imgPath = matchedKey
                          ? directions[matchedKey as keyof typeof directions]
                          : `/directions/${dir.toLowerCase()}.png`;

                        return (
                          <div
                            key={i}
                            className="w-5 h-5 flex items-center justify-center rounded bg-zinc-800 border border-zinc-700 overflow-hidden shadow-inner"
                            title={dir}
                          >
                            <Image
                              src={imgPath}
                              alt={dir}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-zinc-300 leading-normal font-light">
                      {getLocalizedText(eff.ability?.en, eff.ability?.th, "-")}
                    </p>
                  </div>
                ))}
              </div>

              {/* ค่าคอสพลังงาน */}
              <div className="flex items-center gap-2 border-t border-zinc-700/80 pt-2 mt-0.5">
                <span className="text-zinc-400 font-medium">{t("skill.energyCost")} :</span>
                <div className="flex flex-wrap gap-1">
                  {hoveredSkill.energyCosts?.map((cost, idx) => {
                    const costTypeName =
                      typeIdToName[cost.typeId as keyof typeof typeIdToName] ||
                      "Normal";
                    const costIconPath =
                      typeIcon[costTypeName as keyof typeof typeIcon] ||
                      "/typeIcons/Normal.png";

                    return Array.from({ length: cost.quantity || 0 }).map(
                      (_, i) => (
                        <div key={`${idx}-${i}`} className="w-5 h-5">
                          <Face
                            imageUrl1={costIconPath}
                            name1={costTypeName}
                            className="w-full h-full border-none shadow-sm rounded-md !p-0"
                          />
                        </div>
                      ),
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
