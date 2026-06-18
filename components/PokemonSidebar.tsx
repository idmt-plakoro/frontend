// components/PokemonSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getApiPokemonList, GetApiPokemonListResponse } from '@/src/api/generated';
import Face from './Face';
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPokemonId: number;
  onSelectPokemon: (id: number, shouldReset?: boolean) => void;
}

// ปรับคู่สี (พื้นหลังแถบชื่อ และ สีตัวอักษร) ให้ตรงตามการ์ดในภาพ image_65da0a.png
const TYPE_STYLES: Record<number, { label: string; bg: string; text: string; cardLabelBg: string }> = {
  1: { label: 'Grass', bg: 'bg-[#22c55e]', text: 'text-[#14532d]', cardLabelBg: 'bg-[#4ade80]' },       // หญ้า (Bulbasaur)
  2: { label: 'Fire', bg: 'bg-[#ef4444]', text: 'text-[#7c2d12]', cardLabelBg: 'bg-[#f97316]' },        // ไฟ (Charizard)
  3: { label: 'Water', bg: 'bg-[#00c2ff]', text: 'text-white', cardLabelBg: 'bg-[#3b82f6]' },           // น้ำ
  4: { label: 'Electric', bg: 'bg-[#ffcc00]', text: 'text-[#422006]', cardLabelBg: 'bg-[#fef08a]' },    // สายฟ้า (Pikachu)
  5: { label: 'Psychic', bg: 'bg-[#ec4899]', text: 'text-white', cardLabelBg: 'bg-[#f472b6]' },         // พลังจิต
  6: { label: 'Fighting', bg: 'bg-[#b45309]', text: 'text-white', cardLabelBg: 'bg-[#b45309]' },        // ต่อสู้
  7: { label: 'Dark', bg: 'bg-[#007598]', text: 'text-white', cardLabelBg: 'bg-[#1e3a8a]' },            // ความมืด
  8: { label: 'Steel', bg: 'bg-[#6b7280]', text: 'text-white', cardLabelBg: 'bg-[#9ca3af]' },           // โลหะ
  9: { label: 'Dragon', bg: 'bg-[#78716c]', text: 'text-white', cardLabelBg: 'bg-[#d97706]' },          // มังกร
  10: { label: 'Flying', bg: 'bg-[#38bdf8]', text: 'text-white', cardLabelBg: 'bg-[#06b6d4]' },         // บิน
  11: { label: 'Normal', bg: 'bg-[#a3a3a3]', text: 'text-white', cardLabelBg: 'bg-[#cbd5e1]' },         // ไร้สี
};

export default function PokemonSidebar({ isOpen, onClose, currentPokemonId, onSelectPokemon }: SidebarProps) {
  const { t, i18n } = useTranslation();

  const [allPokemon, setAllPokemon] = useState<GetApiPokemonListResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const [hoveredPokemon, setHoveredPokemon] = useState<any | null>(null); 
  const [tempSelectedId, setTempSelectedId] = useState<number | null>(null); 
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false); 

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchList() {
      try {
        const response = await getApiPokemonList();
        const list: GetApiPokemonListResponse = response.data || { success: false, data: [] }; 
        setAllPokemon(list);
      } catch (error) {
        console.error("Failed to fetch pokemon list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(currentPokemonId);
      setHoveredPokemon(null);
    }
  }, [isOpen, currentPokemonId]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 15, y: e.clientY - 40 }); 
  };

  const pokemonList = (allPokemon?.data || []) as any[];

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const enName = String(pokemon.enPokemonName || '');
    const thName = String(pokemon.thPokemonName || '');

    const matchesSearch = 
      enName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thName.includes(searchTerm);
      
    const matchesType = selectedType === null || pokemon.typeId === selectedType;
    
    return matchesSearch && matchesType;
  });

  // เรียงลำดับ ID ธาตุตามปุ่มในภาพเป๊ะๆ: Steel(8), Flying(10), Dragon(9), Water(3), Fire(2), Normal(11), Grass(1), Electric(4), Psychic(5), Dark(7)
  const typeIds = [8, 10, 9, 3, 2, 11, 1, 4, 5, 7]; 

  const handleConfirmSelection = () => {
    if (!tempSelectedId) return;

    if (tempSelectedId === currentPokemonId) {
      setShowWarningModal(true);
    } else {
      onSelectPokemon(tempSelectedId, false);
    }
  };

  const getImageSrc = (val: any) => {
    const s = String(val ?? '').trim();
    return s.length > 0 ? s : '/img/Unknown_Pokemon.png';
  };

  const getDisplayPokemonName = (pokemon: any) => {
    if (i18n.language === 'th' && pokemon.thPokemonName) {
      return String(pokemon.thPokemonName);
    }
    return String(pokemon.enPokemonName || 'Unknown');
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-xs ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* แถบสไลด์ด้านซ้าย */}
      <div className={`fixed inset-y-0 left-0 w-full max-w-[440px] bg-[#121212]/50 border-r border-neutral-900 text-white z-50 flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* ปุ่มกากบาทปิด (✕) */}
        <div className="flex justify-end mb-4 pt-[40px]">
          <button onClick={onClose} className="text-white/90 hover:text-white transition-colors p-1 text-2xl font-light">✕</button>
        </div>

        {/* 🔍 ส่วนค้นหาและฟิลเตอร์เม็ดยา */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative w-full">
            <input 
              type="text"
              placeholder={t("sidebar.searchHint")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#e9e6ed] text-neutral-800 placeholder-neutral-500 pl-5 pr-12 py-3 rounded-full text-sm font-medium focus:outline-none transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* แถบฟิลเตอร์เม็ดยาหลากสี */}
          <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[104px] overflow-y-auto p-1 scrollbar-none font-salsa">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide italic transition-all ${
                selectedType === null 
                  ? "bg-[#8A38F5] text-white ring-2 ring-white scale-105 shadow-md" 
                  : "bg-[#8A38F5] text-white opacity-80 hover:opacity-100"
              }`}
            >
              {t("type.all")}
            </button>
            {typeIds.map((typeId) => {
              const style = TYPE_STYLES[typeId] || { label: `Type ${typeId}`, bg: 'bg-neutral-500' };
              const isSelected = selectedType === typeId;
              return (
                <button
                  key={typeId}
                  onClick={() => setSelectedType(selectedType === typeId ? null : typeId)} // คลิกซ้ำเพื่อเคลียร์ฟิลเตอร์
                  className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide italic transition-all ${
                    isSelected 
                      ? `${style.bg} text-white ring-2 ring-white scale-105 shadow-md` 
                      : `${style.bg} text-white opacity-90 hover:opacity-100`
                  }`}
                >
                  {t(`type.${style.label}`, style.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 📱 รายชื่อโปเกมอน Grid 3 คอลัมน์ ดีไซน์กล่องมนขอบขาวคลีน */}
        <div className="flex-1 overflow-y-auto pt-2 pl-2 pr-3 pb-24 [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-[#007AFF]
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-[#0059BE]">
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#d9d9d9] rounded-2xl aspect-[3/4] w-full animate-pulse" />
              ))}
            </div>
          ) : filteredPokemon.length === 0 ? (
            <div className="text-center text-sm text-neutral-500 py-12">{t("sidebar.notFound")}</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredPokemon.map((pokemon) => {
                const cardStyle = TYPE_STYLES[pokemon.typeId] || { text: 'text-black', cardLabelBg: 'bg-neutral-300' };
                const isSelected = tempSelectedId === pokemon.id;

                return (
                  <div 
                    key={pokemon.id}
                    onClick={() => pokemon.id !== undefined && setTempSelectedId(Number(pokemon.id))} 
                    onMouseEnter={() => setHoveredPokemon(pokemon)} 
                    onMouseLeave={() => setHoveredPokemon(null)}
                    onMouseMove={handleMouseMove}
                    className={`bg-white rounded-2xl overflow-hidden flex flex-col items-center justify-between text-center aspect-[3/4] w-full cursor-pointer transition-all group ${
                      isSelected 
                        ? 'ring-4 ring-yellow-400 scale-[1.03]' 
                        : 'hover:scale-[1.02] border border-transparent'
                    }`}
                  >
                    {/* พื้นที่โชว์รูปภาพสีขาว */}
                    <div className="relative w-full flex-1 flex items-center justify-center p-3">
                        <div className="relative w-full h-full max-h-[75px]">
                          <Image 
                            src={getImageSrc(pokemon.pokemonImage)} 
                            alt={String(pokemon.enPokemonName || 'pokemon')} 
                            fill 
                            className="object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                    </div>
                    
                    {/* แถบป้ายชื่อ*/}
                    <div className={`w-full ${cardStyle.cardLabelBg} py-2 px-1 flex items-center justify-center`}>
                      <span className={`text-[11px] font-bold ${cardStyle.text} truncate w-full px-0.5 tracking-tight`}>
                        {getDisplayPokemonName(pokemon)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* กรณีที่ข้อมูลในแถวนั้นมีไม่ครบ 3 ใบ ให้โชว์กล่องเปล่าสีเทา `bg-[#d9d9d9]` ตกแต่งท้ายตารางเหมือนในภาพ */}
              {filteredPokemon.length > 0 && filteredPokemon.length < 6 && (
                Array.from({ length: 6 - filteredPokemon.length }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="bg-[#d9d9d9] rounded-2xl aspect-[3/4] w-full" />
                ))
              )}
            </div>
          )}
        </div>

        {/* ปุ่มกดบันทึกยืนยันข้อมูล */}
        {/* 🟢 เพิ่ม flex justify-end เพื่อดันปุ่มไปทางขวาสุด */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#111111] via-[#111111]/95 to-transparent pt-8 flex justify-end">
          <button
            onClick={handleConfirmSelection}
            disabled={!tempSelectedId}
            className="w-auto pr-8 pl-8 bg-[#FFDE09] hover:bg-[#eab308] active:scale-[0.99] disabled:bg-neutral-700 disabled:text-neutral-500 text-black font-black text-sm py-3 rounded-xl shadow-lg transition-all border-b-4 border-yellow-700 tracking-wider font-black font-salsa"
          >
            {t("button.confirm")}
          </button>
        </div>

      </div>

      {/* [FLOATING HOVER PREVIEW PANEL] ปรับใช้ Face Component */}
      {hoveredPokemon && (
        <div 
          style={{ top: mousePos.y, left: mousePos.x }}
          className="fixed pointer-events-none z-[100] bg-neutral-900/80 border border-neutral-700 rounded-xl p-3 shadow-2xl flex flex-col justify-center min-w-[220px] max-w-[280px] animate-fadeIn"
        >
          <div className="flex items-start gap-4">
            {/* โซนรูปภาพโปเกมอน */}
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 flex-shrink-0 mt-1">
              <div className="relative w-12 h-12">
                <Image src={getImageSrc(hoveredPokemon?.pokemonImage)} alt="Preview" fill className="object-contain"/>
              </div>
            </div>

            {/* โซนข้อมูลตัวละคร */}
            <div className="flex-1 flex flex-col gap-0.5 text-xs">
              <div className="font-black text-sm text-yellow-400 uppercase tracking-wide truncate max-w-[150px]">
                {i18n.language === 'th' ? (hoveredPokemon.thPokemonName || hoveredPokemon.enPokemonName) : hoveredPokemon.enPokemonName}
              </div>

              {/* ชื่ออีกภาษานึง th-en (ลบได้ถ้าไม่เอา) */}
              <div className="text-neutral-400 text-[10px] truncate max-w-[150px] mb-2">
                {i18n.language === 'th' ? hoveredPokemon.enPokemonName : (hoveredPokemon.thPokemonName || 'ไม่มีชื่อไทย')}
              </div>

              {/* เรียงข้อมูล ธาตุ -> HP -> จุดอ่อน แบบแนวตั้ง */}
              <div className="flex flex-col gap-1.5 mt-1 ">
                
                {/* 1. ธาตุ (Element) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold whitespace-nowrap">{t("pokemonInfo.element")} :</span>
                  {hoveredPokemon.typeId ? (
                    <div className="w-5 h-5 ml-1">
                      <Face 
                        imageUrl1={`/img/Type/${hoveredPokemon.typeId}.png`}
                        name1={TYPE_STYLES[hoveredPokemon.typeId]?.label || 'Normal'}
                        className="w-full h-full border-none shadow-sm rounded-md !p-0"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 font-bold">-</span>
                  )}
                </div>

                {/* 2. HP */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold whitespace-nowrap">{t("pokemonInfo.hp")} :</span>
                  <span className="font-extrabold text-white text-sm">{hoveredPokemon.hp ?? 'N/A'}</span>
                </div>

                {/* 3. จุดอ่อน (Weakness) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold whitespace-nowrap">{t("pokemonInfo.weakness")} :</span>
                  {/* รองรับทั้ง weaknessType หรือ weaknessId เผื่อ API ส่งมาชื่อต่างกัน */}
                  {hoveredPokemon.weaknessTypeId ? (
                    <div className="w-5 h-5 ml-1">
                      <Face 
                        imageUrl1={`/img/Type/${hoveredPokemon.weaknessTypeId}.png`}
                        name1={TYPE_STYLES[hoveredPokemon.weaknessTypeId]?.label || 'Normal'}
                        className="w-full h-full border-none shadow-sm rounded-md !p-0"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 font-bold text-[10px]">None</span>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* [WARNING RESET MODAL] ปรับดีไซน์ตามภาพใหม่เป๊ะๆ */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#444444] rounded-[32px] max-w-md w-full border border-yellow-400 p-8 shadow-2xl flex flex-col items-center justify-center">
            
            {/* ข้อความแจ้งเตือน: ตัวอักษรสีขาว ฟอนต์หนาปานกลาง จัดกึ่งกลาง */}
            <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide text-center leading-relaxed mb-6 select-none max-w-xs sm:max-w-sm">
              {t("modal.resetWarning")}
            </p>

            {/* โซนปุ่มกดแบบคู่ในแนวนอน */}
            <div className="flex gap-5 items-center justify-center w-full">
              {/* ปุ่ม Cancel */}
              <button 
                onClick={() => setShowWarningModal(false)}
                className="bg-[#222222] hover:bg-[#2c2c2c] active:scale-95 text-white font-black text-sm sm:text-base px-6 py-2 rounded-xl border border-neutral-800 shadow-md transition-all tracking-wider"
              >
                {t("button.cancel")}
              </button>
              
              {/* ปุ่ม Continue */}
              <button 
                onClick={() => {
                  setShowWarningModal(false);
                  if (tempSelectedId) onSelectPokemon(tempSelectedId, true);
                }}
                className="bg-[#222222] hover:bg-[#2c2c2c] active:scale-95 text-white font-black text-sm sm:text-base px-6 py-2 rounded-xl border border-neutral-800 shadow-md transition-all tracking-wider"
              >
                {t("button.continue")}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}