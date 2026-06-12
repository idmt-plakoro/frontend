// components/PokemonSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getApiPokemonList, GetApiPokemonListResponse } from '@/src/api/generated';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (id: number) => void;
}

export default function PokemonSidebar({ isOpen, onClose, onSelectPokemon }: SidebarProps) {
  const [allPokemon, setAllPokemon] = useState<GetApiPokemonListResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  
  // State สำหรับการค้นหาและตัวกรอง
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<number | null>(null);

  // 1. ดึงข้อมูลรายการโปเกมอนทั้งหมดตอนเปิด Component
  useEffect(() => {
    async function fetchList() {
      try {
        const response = await getApiPokemonList();
        const list: GetApiPokemonListResponse = response.data || {success: false, data: []}; 
        setAllPokemon(list);
      } catch (error) {
        console.error("Failed to fetch pokemon list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []);

  // 🌟 2. ดึง Array ออกมาแล้วครอบ `as any[]` เพื่อแปลงข้อมูลกลุ่ม unknown ให้พร้อมใช้งาน
  const pokemonList = (allPokemon?.data || []) as any[];

  // 3. Logic สำหรับค้นหาและกรองประเภทธาตุ
  const filteredPokemon = pokemonList.filter((pokemon) => {
    // ใช้ String() ครอบเผื่อไว้ และใช้ค่า Default เป็นข้อความว่าง เพื่อป้องกันกรณีข้อมูลหลุดเป็น null/undefined
    const enName = String(pokemon.enPokemonName || '');
    const thName = String(pokemon.thPokemonName || '');

    const matchesSearch = 
      enName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thName.includes(searchTerm);
      
    const matchesType = selectedType === null || pokemon.typeId === selectedType;
    
    return matchesSearch && matchesType;
  });

  // รายชื่อธาตุจำลองสำหรับทำปุ่ม Filter
  const typeIds = [1, 2, 3, 4, 5, 6,7,8,9,10,11];

  return (
    <>
      {/* Background Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* แถบสไลด์ด้านซ้าย */}
      <div className={`fixed inset-y-0 left-0 w-80 sm:w-96 bg-[#1a1a1a]/50 border-r-4 border-black text-white z-50 flex flex-col p-4 shadow-[4px_0_0_0_rgba(0,0,0,1)] transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* หัวข้อแถบเมนู */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-800">
          <h2 className="text-lg font-black text-yellow-400 uppercase tracking-wider">Select Pokemon</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl">✕</button>
        </div>

        {/* 🔍 ส่วนบน: Search และ Filter Type */}
        <div className="flex flex-col gap-3 mb-4">
          <input 
            type="text"
            placeholder="Search Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#ffffff] border-2 text-black border-black p-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400 font-bold placeholder-gray-500"
          />

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Filter by Type:</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-2.5 py-1 rounded text-xs font-black transition-all border border-black ${
                  selectedType === null ? 'bg-yellow-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-[#2a2a2a] text-gray-400'
                }`}
              >
                ALL
              </button>
              {typeIds.map((typeId) => (
                <button
                  key={typeId}
                  onClick={() => setSelectedType(typeId)}
                  className={`relative p-1 w-7 h-7 rounded transition-all border border-black flex items-center justify-center ${
                    selectedType === typeId ? 'bg-white scale-110 shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-[#2a2a2a]'
                  }`}
                >
                  <div className="relative w-5 h-5">
                    <Image src={`/img/Type/${typeId}.png`} alt={`Type ${typeId}`} fill className="object-contain" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 📱 ส่วนล่าง: รายชื่อโปเกมอนบรรทัดละ 3 แถว */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
          {loading ? (
            <div className="text-center text-xs font-bold text-gray-500 py-10 animate-pulse">Loading list...</div>
          ) : filteredPokemon.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-10">No Pokemon found</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredPokemon.map((pokemon) => (
                <div 
                  key={pokemon.id}
                  onClick={() => pokemon.id !== undefined && onSelectPokemon(Number(pokemon.id))}
                  className="bg-[#2a2a2a] border-2 border-black rounded-xl p-2 flex flex-col items-center justify-between text-center cursor-pointer hover:bg-yellow-400 hover:text-black hover:-translate-y-1 transition-all group shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                >
                  <div className="relative w-14 h-14 mb-1">
                    {pokemon.pokemonImage && (
                      <Image 
                        src={String(pokemon.pokemonImage)} // 🌟 บังคับมองเป็น String ป้องกัน Error รูปภาพ
                        alt={String(pokemon.enPokemonName || 'pokemon')} 
                        fill 
                        className="object-contain group-hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  {/* 🌟 แสดงผลชื่อได้อย่างปลอดภัย ไม่ติดปัญหา ReactNode อีกต่อไป */}
                  <span className="text-[10px] font-black line-clamp-1 truncate w-full">
                    {String(pokemon.enPokemonName || '')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}