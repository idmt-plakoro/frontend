import Image from 'next/image';

interface ProfileProps {
  ImgSrc: string;
  HP: number;
  Type: number | undefined; 
  WeaknessType: number | undefined;
}

export default function PokemonProfile({ImgSrc,HP,Type,WeaknessType}:ProfileProps) {

return (
    <div className="relative w-full h-80 bg-white  rounded-2xl overflow-hidden flex flex-col ">
      
      {/* 🌟 เพิ่มเติม: รูปธาตุหลักที่มุมซ้ายบนของการ์ด */}
      {Type !== undefined && (
        <div className="absolute top-2 left-2 z-20 w-9 h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] bg-white/80 p-1 rounded-full">
          <div className="relative w-full h-full">
            <Image 
              src={`/img/Type/${Type}.png`} 
              alt={`Type ${Type}`} 
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* 🖼️ โซนที่ 1: รูปโปเกมอน (ขนาดความสูงประมาณ 75% ของ card) */}
      <div className="relative h-[75%] w-full bg-gradient-to-b from-gray-50 to-gray-150 flex items-center justify-center p-4">
        {ImgSrc ? (
          <div className="relative w-full h-full">
            <Image 
              src={ImgSrc} 
              alt="Pokemon Image" 
              fill 
              className="object-contain transition-transform hover:scale-105"
            //   priority // ช่วยให้โหลดรูปหลักของหน้าเว็บขึ้นมาทันที
            />
          </div>
        ) : (
          <div className="text-gray-400 text-xs font-bold animate-pulse">Loading Image...</div>
        )}
      </div>

      {/* 📊 โซนที่ 2: โชว์ข้อมูล (ขนาดความสูงประมาณ 25% ของ card) */}
      <div className="flex items-center justify-between bg-[#111111] text-xl text-white py-3 px-4 rounded-xl border border-neutral-800 select-none w-fit min-w-[240px]">
  
        {/* ฝั่งซ้าย: ข้อความ HP และ Weakness เรียงต่อกันแนวตั้ง */}
        <div className="flex flex-col gap-1 font-black tracking-wider text-yellow-400">
            <div>
            HP : {HP ?? 0}
            </div>
            <div className="flex items-center gap-1">
            Weakness :
            </div>
        </div>

        {/* ฝั่งขวา: ไอคอนธาตุ (ดันไปขวาสุดด้วย ml-auto หรือใช้ justify-between จากตัวแม่) */}
        <div className="ml-6 flex items-center justify-center">
            {WeaknessType !== undefined ? (
            <div className="relative w-12 h-12 p-2 ">
                <Image 
                src={`/img/Type/${WeaknessType}.png`} 
                alt={`Weakness ${WeaknessType}`}
                fill
                className="object-contain p-1"
                />
            </div>
            ) : (
            <span className="text-gray-500 text-xs font-bold">None</span>
            )}
        </div>

        </div>

    </div>
  );
}