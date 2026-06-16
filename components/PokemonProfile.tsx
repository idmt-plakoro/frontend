import Image from 'next/image';
import Face from './Face'; // 🌟 อย่าลืม import Face component เข้ามาด้วยนะครับ
import { useEffect, useState } from 'react';
import { getApiFaceTypes } from '@/src/api/generated';

interface ProfileProps {
  ImgSrc: string;
  HP: number;
  Type: number | undefined; 
  WeaknessType: number | undefined;
}

const getTypeName = (id: number): string => {
  const typeNames: Record<number, string> = {
    1: 'Grass', 2: 'Fire', 3: 'Water', 4: 'Electric', 5: 'Psychic',
    6: 'Fighting', 7: 'Dark', 8: 'Steel', 9: 'Dragon', 10: 'Flying', 11: 'Normal',
  };
  return typeNames[id] || 'Normal';
};

export default function PokemonProfile({ImgSrc,HP,Type,WeaknessType}:ProfileProps) {

return (
    <div className="relative w-full h-80 bg-white  rounded-2xl overflow-hidden flex flex-col ">
      
      

      {/* 🌟 โซนไอคอนธาตุหลัก มุมซ้ายบนของการ์ด */}
      {Type !== undefined && (
        <div className="absolute top-0 left-0 z-20 w-11 h-11 shadow-lg rounded-2xl rounded-br-full overflow-hidden backdrop-blur-sm p-0.5">
          <Face 
            imageUrl1={`/img/Type/${Type}.png`}
            name1={getTypeName(Type)}
            className="w-full h-full border-none shadow-sm rounded-br-full !p-0"
          />
        </div>
      )}

      {/* 🖼️ โซนที่ 1: รูปโปเกมอน */}
      <div className="relative h-[75%] w-full bg-gradient-to-b from-gray-50 to-gray-150 flex items-center justify-center p-4">
        {ImgSrc ? (
          <div className="relative w-full h-full">
            <Image 
              src={ImgSrc} 
              alt="Pokemon Image" 
              fill 
              className="object-contain transition-transform hover:scale-105"
              priority // ช่วยให้โหลดรูปหลักของหน้าเว็บขึ้นมาทันที
            />
          </div>
        ) : (
          <div className="text-gray-400 text-xs font-bold animate-pulse">Loading Image...</div>
        )}
      </div>

      {/* 📊 โซนที่ 2: โชว์ข้อมูล  */}
      <div className="flex items-center justify-between bg-[#121212] text-xl text-white py-3 px-4 rounded-xl select-none w-fit min-w-[240px]">
  
        {/* ฝั่งซ้าย: ข้อความ HP และ Weakness เรียงต่อกันแนวตั้ง */}
        <div className="flex flex-col gap-1 font-black tracking-wider text-[#FFE600]">
            <div>
            HP : {HP ?? 0}
            </div>
            <div className="flex items-center gap-1">
            Weakness :
            </div>
        </div>

        {/* ฝั่งขวา: ไอคอนธาตุจุดอ่อน */}
        <div className="pr-2 mr-7 mt-7 flex items-center justify-center">
            {WeaknessType !== undefined ? (
              <div className="relative w-10 h-10">
                {/* เรียกใช้งาน Face แทน Image */}
                <Face 
                  imageUrl1={`/img/Type/${WeaknessType}.png`} 
                  name1={getTypeName(WeaknessType)} // ส่งชื่อธาตุไปเพื่อดึงสี
                  className="w-full h-full border-none shadow-md"
                />
              </div>
            ) : (
              <span className="text-gray-500 text-xs font-bold mt-[-20px] ml-5">None</span>
            )}
        </div>

        </div>

    </div>
  );
}