import Image from 'next/image';

interface DiceDisplayRowProps {
  diceFaces: number[]; // Array ตัวเลข 6 ตำแหน่ง เช่น [1, 2, 2, 3, 4, 1]
  onEditClick: () => void; // ฟังก์ชันที่จะทำงานเมื่อกดปุ่มเปิด Modal
  rowLabel?: string; // ป้ายกำกับแถว (เผื่ออยากใส่เช่น Dice 1, Dice 2)
}

export default function DiceDisplayRow({ diceFaces, onEditClick, rowLabel }: DiceDisplayRowProps) {
  return (
    <div className="flex items-center gap-4 bg-transparent py-2 w-full">
      
      {/* 1. ปุ่มซ้ายสุดสำหรับเปิด Modal */}
      <button 
        onClick={onEditClick}
        className="relative w-14 h-14 bg-white hover:bg-neutral-200 rounded-full flex items-center justify-center border-4 border-neutral-800 shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:scale-95 transition-all flex-shrink-0 group"
        title="Edit Dice"
      >
        <div className="relative w-[100%] h-[100%] group-hover:scale-105 transition-transform">
          <Image 
            src="/img/dice-edit-icon.png" // เปลี่ยนเป็นพาธรูปไอคอนลูกเต๋าขอบเหลืองทองของคุณ
            alt="Edit"
            fill
            className="object-contain"
          />
        </div>
      </button>

      {/* เผื่ออยากแสดงชื่อแถวเล็กๆ */}
      {/* {rowLabel && (
        <span className="text-xs font-bold text-gray-400 min-w-[45px]">{rowLabel}</span>
      )} */}

      {/* 2. โซนแสดงผลธาตุ 6 ด้านจาก Array */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 flex-grow">
        {diceFaces.map((typeId, index) => (
          <div 
            key={index} 
            className="relative aspect-square w-full min-w-[40px] max-w-[55px] rounded-lg flex items-center justify-center border-2 border-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_0_4px_6px_rgba(0,0,0,0.2)]"
          >
            <div className="relative w-[75%] h-[75%]">
              <Image 
                src={`/img/Type/${typeId}.png`} 
                alt={`Face ${index + 1} - Type ${typeId}`}
                fill
                className="object-contain filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}