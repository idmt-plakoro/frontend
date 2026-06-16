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
        <div className="absolute top-0 left-0 z-20 w-15 h-15 bg-white/80 rounded-full">
          <div className="relative w-full h-full ">
            <Image 
              src={`/img/Type/${Type}.png`} 
              alt={`Type ${Type}`} 
              fill
              className="object-contain rounded-br-full"
            />
          </div>
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

        {/* ฝั่งขวา: ไอคอนธาตุ */}
        <div className="mr-7 mt-7 flex items-center justify-center">
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