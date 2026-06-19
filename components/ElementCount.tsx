// components/ElementCount.tsx
import React, { useState, useEffect } from "react";
import { getApiFaceTypes } from "@/src/api/generated";
import Face from "./Face";
import { useTranslation } from "react-i18next";

interface ElementCountProps {
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  };
}

export default function ElementCount({ diceData }: ElementCountProps) {
  const { t } = useTranslation();
  const { dice1, dice2, dice3 } = diceData;
  const [faceTypesList, setFaceTypesList] = useState<any[]>([]);

  // ดึงข้อมูล face types จาก API เพื่อให้ได้องค์ประกอบของแต่ละหน้าเต๋าจริง
  useEffect(() => {
    getApiFaceTypes().then((res) => {
      if (res.data?.success) {
        setFaceTypesList(res.data.data);
      }
    });
  }, []);

  // 1. รวมแต้มลูกเต๋าทั้ง 3 แถวเข้าเป็นอาร์เรย์ก้อนเดียว
  const allFaceTypeIds = [...dice1, ...dice2, ...dice3];

  // 2. ลูปเพื่อดึงประเภทธาตุที่แท้จริงจากแต่ละหน้าเต๋าและนับจำนวน
  const counts: Record<number, { count: number; name: string; img: string }> =
    {};

  allFaceTypeIds.forEach((faceTypeId) => {
    if (!faceTypeId) return;
    const foundFaceType = faceTypesList.find(
      (ft) => ft.faceTypesId === faceTypeId,
    );
    if (
      foundFaceType &&
      foundFaceType.types &&
      foundFaceType.types.length > 0
    ) {
      foundFaceType.types.forEach((t: any) => {
        if (!counts[t.id]) {
          counts[t.id] = {
            count: 0,
            name: t.enName || "Normal",
            img: t.typeImage || `/img/Type/${t.id}.png`,
          };
        }
        counts[t.id].count += 1;
      });
    } else {
      // Fallback ระหว่างรอโหลดข้อมูลจาก API หรือถ้าไม่พบ ID
      const fallbackName =
        faceTypeId === 1
          ? "Grass"
          : faceTypeId === 2
            ? "Fire"
            : faceTypeId === 3
              ? "Water"
              : faceTypeId === 4
                ? "Electric"
                : faceTypeId === 5
                  ? "Psychic"
                  : faceTypeId === 6
                    ? "Fighting"
                    : faceTypeId === 7
                      ? "Dark"
                      : faceTypeId === 8
                        ? "Steel"
                        : faceTypeId === 9
                          ? "Flying"
                          : faceTypeId === 10
                            ? "Dragon"
                            : "Normal";
      const fallbackImg = `/img/Type/${faceTypeId}.png`;
      if (!counts[faceTypeId]) {
        counts[faceTypeId] = {
          count: 0,
          name: fallbackName,
          img: fallbackImg,
        };
      }
      counts[faceTypeId].count += 1;
    }
  });

  // 3. แปลงเป็น Array -> เรียงลำดับจากมากไปน้อย -> ตัดเอาเฉพาะ Top 3 อันดับแรก
  const topElements = Object.entries(counts)
    .map(([id, item]) => ({
      id: Number(id),
      name: item.name,
      img: item.img,
      count: item.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="w-full md:w-75 h-auto md:h-full bg-[#1E1E1E] text-white rounded-2xl p-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]/20 flex flex-col">
      {/* ส่วนหัวข้อชื่อกรอบ */}
      <h3 className="text-xl font-black italic text-center tracking-wide uppercase">
        {t("elementCount.title")}
      </h3>

      {/* เส้นแบ่งเลเยอร์ตามดีไซน์ */}
      <hr className="bg-white/70 h-0.5 m-2.5" />

      {/* รายการแสดงผล Top 3 */}
      <div className="flex-1 flex flex-col justify-center gap-4 py-2">
        {topElements.map((element) => {
          const localizedName = t(`type.${element.name}`);
          return (
            <div
              key={element.id}
              className="flex items-center gap-6 pl-4 animate-fadeIn"
            >
              {/* กล่องใส่รูปไอคอนธาตุ และตัวเลข Badge ทับมุมล่างขวา */}
              <div className="relative w-12 h-12">
                <Face
                  imageUrl1={element.img}
                  name1={element.name}
                  className="w-full h-full border-none p-1.5"
                />

                {/* วงกลมดำตัวเลขบอกจำนวน ซ้อนเหลื่อมมุมขวาล่างตามรูปตัวอย่าง */}
                <div className="absolute -bottom-1 -right-2 bg-black text-white text-[14px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                  {element.count}
                </div>
              </div>

              {/* ข้อความชื่อธาตุตัวหนาพิเศษ */}
              <span className="text-xl font-black tracking-wide italic">
                {localizedName}
              </span>
            </div>
          );
        })}

        {/* ตัวดักสเตตัสเผื่อกรณีไม่มีข้อมูลเต๋าอยู่ในระบบเลย */}
        {topElements.length === 0 && (
          <div className="text-center text-xs text-gray-500 py-6 font-bold">
            {t("elementCount.noElements")}
          </div>
        )}
      </div>
    </div>
  );
}
