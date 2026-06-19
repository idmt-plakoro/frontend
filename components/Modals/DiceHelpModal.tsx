"use client";

import React from "react";
import { useTranslation, Trans } from "react-i18next";

interface DiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiceHelpModal({ isOpen, onClose }: DiceHelpModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // ฟอร์แมตสำหรับคำที่ต้องการ Highlight ในไฟล์ JSON
  const textFormats = {
    yellow: <span className="text-[#fdd835] font-bold" />,
    white: <span className="text-white font-bold inline-block mr-1" />,
    highlight: <span className="text-yellow-100 font-semibold" />,
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 ">
      {/* 📦 Outer Container (สีเทาเข้ม) */}
      <div className="bg-[#666666] w-full max-w-lg h-[600px] p-6 rounded-xl shadow-2xl flex flex-col font-salsa relative animate-fadeIn">
        
        {/* 📋 Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-white text-3xl font-bold tracking-wide leading-tight">
              {t("dice_guide.title")}
            </h2>
            <p className="text-white/70 text-sm font-medium">
              {t("dice_guide.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl leading-none font-light transition-transform hover:scale-110 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* เส้นคั่น */}
        <div className="w-full h-[2px] bg-white/30 mb-6"></div>

        {/* 📜 Inner Content Box (สีเทาอ่อน + Scrollbar) */}
        <div
          className="bg-[#999999] flex-1 overflow-y-auto p-4 pr-3 text-white font-sans text-sm
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#555555]
            [&::-webkit-scrollbar-thumb]:rounded-full shadow-inner"
        >
          <div className="space-y-6">
            {/* กล่องเกริ่นนำ */}
            <div className="bg-black/10 p-4 rounded-lg border border-black/5 italic text-white/90">
              {t("dice_guide.description")}
            </div>

            {/* 📦 ส่วนที่ 1: ส่วนประกอบของหน้า */}
            <section className="space-y-3">
              <h3 className="font-bold text-lg text-[#fdd835] drop-shadow-sm flex items-center gap-2">
                🎮 {t("dice_guide.components.title")}
              </h3>
              <div className="grid gap-3">
                <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                  <p><span className="text-white font-bold">{t("dice_guide.components.topic.dice_name")}:</span> {t("dice_guide.components.description.dice_name")}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg border border-white/5 space-y-2">
                  <p><span className="text-white font-bold">{t("dice_guide.components.topic.custom_area")}:</span> {t("dice_guide.components.description.custom_area")}</p>
                  <ul className="pl-4 space-y-1 text-white/80 border-l-2 border-white/20">
                    <li>• <span className="text-white font-semibold">{t("dice_guide.components.topic.axis_face")}:</span> {t("dice_guide.components.description.axis_face")}</li>
                    <li>• <span className="text-white font-semibold">{t("dice_guide.components.topic.fill_face")}:</span> {t("dice_guide.components.description.fill_face")}</li>
                  </ul>
                </div>
                <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                  <p><span className="text-white font-bold">{t("dice_guide.components.topic.library")}:</span> {t("dice_guide.components.description.library")}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg border border-white/5 space-y-2">
                   <p><span className="text-white font-bold">{t("dice_guide.components.topic.buttons.controlButton")}:</span></p>
                   <div className="grid grid-cols-2 gap-2 pl-2">
                      <div className="text-xs bg-black/20 p-2 rounded">
                        <span className="text-yellow-200 font-bold">{t("dice_guide.components.topic.buttons.clear")}:</span> {t("dice_guide.components.description.buttons.clear")}
                      </div>
                      <div className="text-xs bg-black/20 p-2 rounded">
                        <span className="text-yellow-200 font-bold">{t("dice_guide.components.topic.buttons.save")}:</span> {t("dice_guide.components.description.buttons.save")}
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* 📦 ส่วนที่ 2: วิธีการปรับแต่ง */}
            <section className="space-y-3">
              <h3 className="font-bold text-lg text-[#fdd835] drop-shadow-sm flex items-center gap-2">
                🛠️ {t("dice_guide.steps.title")}
              </h3>
              <div className="space-y-3">
                <div className="bg-black/10 p-4 rounded-lg border-l-4 border-[#fdd835]">
                   <Trans i18nKey="dice_guide.steps.step1" components={textFormats} />
                </div>
                <div className="bg-black/10 p-4 rounded-lg border-l-4 border-[#fdd835]">
                   <Trans i18nKey="dice_guide.steps.step2" components={textFormats} />
                </div>
                <div className="bg-black/10 p-4 rounded-lg border-l-4 border-[#fdd835]">
                   <p><Trans i18nKey="dice_guide.steps.step3" components={textFormats} /></p>
                   <p className="mt-2 text-xs text-white/70 bg-black/20 p-2 rounded">
                    💡 {t("dice_guide.steps.step3_1")}
                   </p>
                </div>
                <div className="bg-black/10 p-4 rounded-lg border-l-4 border-[#fdd835]">
                   <Trans i18nKey="dice_guide.steps.step4" components={textFormats} />
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* 🏁 Footer */}
        <div className="mt-4 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-[#555555] hover:bg-[#444444] text-white font-bold rounded-lg transition-colors border border-white/10 text-xs uppercase tracking-widest"
           >
             {t("button.close")}
           </button>
        </div>

      </div>
    </div>
  );
}