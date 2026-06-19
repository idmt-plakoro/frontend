"use client";

import React from "react";
import { useTranslation, Trans } from "react-i18next";

interface CalculationHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculationHelpModal({ isOpen, onClose }: CalculationHelpModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // คอมโพเนนต์สำหรับตกแต่งคำที่ถูกครอบด้วย Tag ในไฟล์ i18next JSON
  const textFormats = {
    yellow: <span className="text-[#fdd835] font-bold drop-shadow-sm" />,
    highlight: <span className="text-yellow-200 font-semibold" />,
    white: <span className="text-white font-bold inline-block text-base mr-1.5" />,
    br: <br />,
  };

  return (
    // Overlay พื้นหลังสีดำโปร่งแสง
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 ">
      
      {/* 📦 กล่อง Modal หลัก */}
      <div className="relative flex flex-col w-full max-w-[600px] bg-[#636363] rounded border-[1px] border-[#707070] p-6 shadow-2xl h-[70vh] font-salsa animate-fadeIn">
        
        {/* 📋 Header (Title, Subtitle & Close Button) */}
        <div className="flex justify-between items-start mb-2 pr-2">
          <div>
            <h2 className="text-white text-[28px] font-bold leading-none tracking-wide">
              {t("help_modal.title")}
            </h2>
            <p className="text-[#cccccc] text-[15px] mt-1.5 font-sans">
              {t("help_modal.subtitle")}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-transform hover:scale-110 text-3xl leading-none font-light"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* เส้นคั่น Divider */}
        <div className="w-full h-[2px] bg-[#8a8a8a] mb-5 rounded-full" />

        {/* 📜 Content Area (กรอบสีเทาอ่อนด้านใน พร้อม Custom Scrollbar) */}
        <div 
          className="flex-1 bg-[#959595] rounded overflow-y-auto p-4 pr-3 space-y-6 font-sans text-sm text-white/95 leading-relaxed shadow-inner
            [&::-webkit-scrollbar]:w-[6px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-track]:my-2
            [&::-webkit-scrollbar-thumb]:bg-[#6e6e6e]
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* ส่วนที่ 1: ภาพรวม */}
          <div className="bg-black/15 p-4 rounded-xl border border-black/10">
            <p>
              <Trans i18nKey="help_modal.overview" components={textFormats} />
            </p>
          </div>

          {/* ส่วนที่ 2: ขั้นตอนการใช้งาน */}
          <div className="space-y-3 pt-1">
            <h3 className="pl-3 text-lg font-black tracking-wide text-[#fdd835] font-salsa flex items-center gap-2 border-b border-black/10 pb-1.5 drop-shadow-md">
                {t("help_modal.step_title")}
            </h3>
            
            <div className="space-y-3 pl-1">
              <div className="bg-black/10 p-3.5 rounded-lg border border-black/5">
                <Trans i18nKey="help_modal.step1" components={textFormats} />
              </div>
              <div className="bg-black/10 p-3.5 rounded-lg border border-black/5">
                <Trans i18nKey="help_modal.step2" components={textFormats} />
              </div>
              <div className="bg-black/10 p-3.5 rounded-lg border border-black/5">
                <Trans i18nKey="help_modal.step3" components={textFormats} />
              </div>
              <div className="bg-black/10 p-3.5 rounded-lg border border-black/5">
                <Trans i18nKey="help_modal.step4" components={textFormats} />
              </div>
            </div>
          </div>

          {/* ส่วนที่ 3: หมายเหตุ & ข้อควรรู้ */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-black tracking-wide text-[#fdd835] font-salsa flex items-center gap-2 border-b border-black/10 pb-1.5 drop-shadow-md">
              💡 {t("help_modal.note_title")}
            </h3>

            <div className="space-y-4 pl-1 pb-4">
              {/* ข้อจำกัดลูกเต๋า */}
              <blockquote className="bg-black/10 p-3.5 rounded-lg border-l-4 border-[#fdd835]">
                <h4 className="font-bold text-white flex items-center gap-2 mb-1">
                   {t("help_modal.note_dice_limit_title")}
                </h4>
                <p className="text-white/80 text-xs">
                  {t("help_modal.note_dice_limit_desc")}
                </p>
              </blockquote>

              {/* การอ้างอิงแพ็คเกจ */}
              <blockquote className="bg-black/10 p-3.5 rounded-lg border-l-4 border-[#fdd835]">
                <h4 className="font-bold text-white flex items-center gap-2 mb-1">
                   {t("help_modal.note_pkg_title")}
                </h4>
                <p className="text-white/80 text-xs">
                  {t("help_modal.note_pkg_desc")}
                </p>
              </blockquote>

              {/* ความหมายของเปอร์เซ็นต์ */}
              <blockquote className="bg-black/10 p-3.5 rounded-lg border-l-4 border-[#fdd835]">
                <h4 className="font-bold text-white flex items-center gap-2 mb-1">
                   {t("help_modal.note_percent_title")}
                </h4>
                <p className="text-white/80 text-xs leading-normal">
                  <Trans i18nKey="help_modal.note_percent_desc" components={textFormats} />
                </p>
              </blockquote>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}