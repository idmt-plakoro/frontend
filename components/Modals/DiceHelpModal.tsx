"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface DiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiceHelpModal({ isOpen, onClose }: DiceHelpModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 ">
      {/* 🟢 Outer Container (พื้นหลังสีเทาเข้ม) */}
      <div className="bg-[#666666] w-full max-w-lg h-[550px] p-6 rounded-xl shadow-2xl flex flex-col font-salsa relative animate-fadeIn">
        
        {/* 🟢 Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-wide">
              {t("dice_guide.title")}
            </h2>
            <p className="text-white/80 text-sm font-medium">
              {t("dice_guide.subtitle", "How to Cuztomize the Dice")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-3xl leading-none font-light transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 🟢 Divider (เส้นคั่น) */}
        <div className="w-full h-px bg-white/40 mb-6"></div>

        {/* 🟢 Inner Content Box (พื้นหลังสีเทาอ่อน + Scrollbar บางๆ) */}
        <div
          className="bg-[#999999] flex-1 overflow-y-auto p-5 text-white/90 font-sans
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-track]:my-2
            [&::-webkit-scrollbar-thumb]:bg-[#555555]
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* เนื้อหาด้านในจัดโครงสร้างตามไฟล์ JSON ที่สร้างไว้ */}
          <div className="space-y-6 text-sm">
            <p>{t("dice_guide.description")}</p>

            {/* ส่วนที่ 1: ส่วนประกอบของหน้าจอ */}
            <section>
              <h3 className="font-bold text-lg mb-2 text-white">1. {t("dice_guide.components.title")}</h3>
              <ul className="space-y-2">
                <li><strong>{t("dice_guide.components.topic.dice_name")}:</strong> {t("dice_guide.components.description.dice_name")}</li>
                <li><strong>{t("dice_guide.components.topic.custom_area")}:</strong> {t("dice_guide.components.description.custom_area")}
                  <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-white/80">
                    <li><strong>{t("dice_guide.components.topic.axis_face")}:</strong> {t("dice_guide.components.description.axis_face")}</li>
                    <li><strong>{t("dice_guide.components.topic.fill_face")}:</strong> {t("dice_guide.components.description.fill_face")}</li>
                  </ul>
                </li>
                <li><strong>{t("dice_guide.components.topic.library")}:</strong> {t("dice_guide.components.description.library")}</li>
                <li><strong>{t("dice_guide.components.topic.buttons.controlButton")}:</strong>
                  <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-white/80">
                    <li><strong>{t("dice_guide.components.topic.buttons.clear")}:</strong> {t("dice_guide.components.description.buttons.clear")}</li>
                    <li><strong>{t("dice_guide.components.topic.buttons.save")}:</strong> {t("dice_guide.components.description.buttons.save")}</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* ส่วนที่ 2: วิธีการปรับแต่ง */}
            <section>
              <h3 className="font-bold text-lg mb-2 text-white">2. {t("dice_guide.steps.title")}</h3>
              <ul className="list-decimal list-inside space-y-3">
                <li>{t("dice_guide.steps.step1")}</li>
                <li>{t("dice_guide.steps.step2")}</li>
                <li>
                  {t("dice_guide.steps.step3")}
                  <ul className="list-disc list-inside pl-6 mt-1 text-white/80">
                    <li>{t("dice_guide.steps.step3_1")}</li>
                  </ul>
                </li>
                <li>{t("dice_guide.steps.step4")}</li>
              </ul>
            </section>
          </div>
        </div>
        
      </div>
    </div>
  );
}