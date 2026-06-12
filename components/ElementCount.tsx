// components/ElementCount.tsx
import React from 'react';
import Image from 'next/image';

interface ElementCountProps {
  diceData: {
    dice1: number[];
    dice2: number[];
    dice3: number[];
  };
}

// 🗺️ ดิกชันนารีจับคู่ ID กับ ชื่อธาตุและพาธรูปภาพ (ปรับเปลี่ยนให้ตรงกับระบบจริงได้เลยครับ)
const elementMapping: Record<number, { name: string; img: string }> = {
  1: { name: 'Leaf', img: '/img/Type/1.png' },
  2: { name: 'Fire', img: '/img/Type/2.png' },
  3: { name: 'Water', img: '/img/Type/3.png' },
  4: { name: 'Electric', img: '/img/Type/4.png' },
  5: { name: 'Psychic', img: '/img/Type/5.png' },
  6: { name: 'Fighting', img: '/img/Type/6.png' },
};

export default function ElementCount({ diceData }: ElementCountProps) {
  const { dice1, dice2, dice3 } = diceData;
  
  // 1. รวมแต้มลูกเต๋าทั้ง 3 แถวเข้าเป็นอาร์เรย์ก้อนเดียว
  const allElements = [...dice1, ...dice2, ...dice3];

  // 2. ลูปเพื่อนับจำนวนครั้งที่เจอของแต่ละธาตุ
  const counts: Record<number, number> = {};
  allElements.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  // 3. แปลงเป็น Array -> เรียงลำดับจากมากไปน้อย -> ตัดเอาเฉพาะ Top 3 อันดับแรก
  const topElements = Object.entries(counts)
    .map(([id, count]) => ({
      id: Number(id),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="w-full md:w-[300px] h-full bg-[#2a2a2a] text-white rounded-2xl p-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]/20 flex flex-col">
      {/* ส่วนหัวข้อชื่อกรอบ */}
      <h3 className="text-xl font-black italic text-center tracking-wide uppercase">
        Element Count
      </h3>
      
      {/* เส้นแบ่งเลเยอร์ตามดีไซน์ */}
      <hr className="border-gray-600 my-2.5" />

      {/* รายการแสดงผล Top 3 */}
      <div className="flex-1 flex flex-col justify-center gap-4 py-2">
        {topElements.map(({ id, count }) => {
          // ค้นหาข้อมูลชื่อและรูปภาพ ถ้าไม่เจอจะใส่ค่า Default เผื่อกันระบบพังไว้ให้ครับ
          const elementInfo = elementMapping[id] || { name: `Type ${id}`, img: `/img/Type/1.png` };
          
          return (
            <div key={id} className="flex items-center gap-6 pl-4 animate-fadeIn">
              
              {/* กล่องใส่รูปไอคอนธาตุ และตัวเลข Badge ทับมุมล่างขวา */}
              <div className="relative w-12 h-12 bg-white border border-gray-700 rounded-lg p-1.5 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image 
                    src={elementInfo.img} 
                    alt={elementInfo.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
                
                {/* วงกลมดำตัวเลขบอกจำนวน ซ้อนเหลื่อมมุมขวาล่างตามรูปตัวอย่าง */}
                <div className="absolute -bottom-1 -right-2 bg-black text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {count}
                </div>
              </div>

              {/* ข้อความชื่อธาตุตัวหนาพิเศษ */}
              <span className="text-xl font-black tracking-wide italic">
                {elementInfo.name}
              </span>

            </div>
          );
        })}

        {/* ตัวดักสเตตัสเผื่อกรณีไม่มีข้อมูลเต๋าอยู่ในระบบเลย */}
        {topElements.length === 0 && (
          <div className="text-center text-xs text-gray-500 py-6 font-bold">No elements selected</div>
        )}
      </div>
    </div>
  );
}