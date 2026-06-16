"use client";

import React, { useEffect, useState } from 'react';
import PokemonProfile from './PokemonProfile';
import DiceDisplayRow from './DiceDisplayRow';
import PokemonSidebar from './PokemonSidebar';
import { getApiPokemonByPokemonId } from '@/src/api/generated/sdk.gen';
import ElementCount from './ElementCount';
import { client } from '@/src/api/generated/client.gen';

client.setConfig({
  baseUrl: 'http://localhost:3000',
});


export default function Dashboard() {

  const [pokemonId, setPokemonId] = useState<number>(1);
  
  const [pokemonInfo, setPokemonInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [diceData, setDiceData] = useState({
    dice1: [1, 2, 3, 4, 5, 6],
    dice2: [2, 2, 4, 4, 1, 1],
    dice3: [6, 6, 6, 3, 3, 2],
  });

  // State สำหรับควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State สำหรับจำว่ากำลังกดแก้ไขลูกเต๋าแถวไหนอยู่ (dice1, dice2, หรือ dice3)
  const [selectedDiceRow, setSelectedDiceRow] = useState<string | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState<boolean>(false);
  const [currentSkill, setCurrentSkill] = useState<any>({ name: 'Fire Blast', damage: 40 });
  const [firstTurn, setFirstTurn] = useState<boolean>(false);
  
  // โครงสร้างเก็บข้อมูลลูกเต๋าที่โดนแบน บังคับ Default เป็น แถวที่ 3 ลูกแรก (index: 0)
  const [banDice, setBanDice] = useState<{ row: string; index: number }>({
    row: 'dice3',
    index: 0
  });

  useEffect(() => {
    async function fetchNewPokemon() {
      setLoading(true);
      try {
        console.log("Fetching data for Pokemon ID:", pokemonId);
        const response = await getApiPokemonByPokemonId({  path: {
            pokemonId: pokemonId,
          },
        });
        setPokemonInfo(response.data?.data);
      } catch (error) {
        console.error("Failed to fetch pokemon data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewPokemon();
  }, [pokemonId]);
  
  const handleChangePokemon = (newId: number) => {
    setPokemonId(newId); // พอสั่งเปลี่ยน ID ปุ๊บ useEffect ข้างบนจะทำงานอัตโนมัติทันที!
  };

  

  const handleOpenModal = (rowName: string) => {
    setSelectedDiceRow(rowName);
    setIsModalOpen(true);
  };


  // 🌟 ฟังก์ชันบันทึกข้อมูลหลังจากกดเซฟใน SkillModal
  const handleSaveSkill = (updatedSkill: any) => {
    setCurrentSkill(updatedSkill);
    console.log("Updated Current Skill Data:", updatedSkill);
  };

  // 🌟 ฟังก์ชันคำนวณหลังกดปุ่ม Calculate
  const handleCalculate = () => {
    console.log("--- Starting Calculation Process ---");
    console.log("Target Skill:", currentSkill);
    console.log("Active Dice Set:", diceData);
    console.log("First Turn Active?:", firstTurn);
    if (firstTurn) {
      console.log(`Banned Target: ${banDice.row} at element index [${banDice.index}]`);
    }
    alert("Calculating results! Check console for transmitted datasets.");
  };

  return (
    // Background ลายลูกเต๋า (สมมติว่าเป็นสีเทาอ่อนไปก่อน)
    <div className="min-h-screen p-8 bg-gray-200 flex justify-center">
      
      {/* กล่อง Container สีขาวหลัก */}
      <div className="z-2 bg-white w-full max-w-6xl rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
        
        {/* Header (Title + Share/Save Button) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black bg-[#1a1a1a] text-yellow-400 px-6 py-2 rounded-full border-2 border-yellow-400 shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
            Plakoro First Dice set ({pokemonInfo?.name?.en})
          </h1>
          <div className="flex gap-4">
            <button className="bg-yellow-300 font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition">
              Share
            </button>
            <button className="bg-yellow-400 font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition">
              Save
            </button>
          </div>
        </div>

        {/* Stats Components (Pokemon Profile, Dice, Elements) */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
        
          {/* Pokemon Profile */}
          <div className="w-full md:w-[220px] max-w-[250px] rounded-xl p-2 
          flex flex-col items-center justify-center cursor-pointer"
           onClick={(e) => {e.stopPropagation(); setIsSidebarOpen(true);}} >
             <PokemonProfile 
                  ImgSrc={pokemonInfo?.pokemonImage} 
                  HP={pokemonInfo?.hp} 
                  Type={pokemonInfo?.typeId} 
                  WeaknessType={pokemonInfo?.weaknessTypeId}
                />
          </div>

          {/* Dice Customization */}
          <div className="flex-1 min-h-[150px] bg-[#1e1e1e] text-white rounded-xl p-4 flex flex-col justify-between">
            <div className="w-full mb-4">
              <div className="flex items-center gap-3 mb-2">
                {/* ไอคอนสี่เหลี่ยมในวงกลมสีเหลือง */}
                <div className="w-9 h-9 rounded-full border-[3px] border-yellow-400 bg-[#1e1e1e] flex items-center justify-center flex-shrink-0">
                  {/* ไอคอนสี่เหลี่ยมในวงกลมสีเหลือง */}
                    <div className="w-9 h-9 rounded-full border-[3px] border-yellow-400 bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 shadow-md">
                      {/* ตัวกล่องลูกบาศก์ 3 มิติ (Isometric Cube SVG) */}
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6 text-neutral-400"
                        fill="currentColor"
                      >
                        {/* ด้านบนของลูกบาศก์ (Top Face) - สีเทาอ่อน */}
                        <path 
                          d="M12 2L2 7l10 5 10-5-10-5z" 
                          fill="#b3b3b3" 
                          stroke="#1a1a1a" 
                          strokeWidth="1"
                        />
                        {/* ด้านซ้าย (Left Face) - สีเทากลาง */}
                        <path 
                          d="M2 7v10l10 5V12L2 7z" 
                          fill="#8c8c8c" 
                          stroke="#1a1a1a" 
                          strokeWidth="1"
                        />
                        {/* ด้านขวา (Right Face) - สีเทาเข้ม */}
                        <path 
                          d="M12 12v10l10-5V7L12 12z" 
                          fill="#666666" 
                          stroke="#1a1a1a" 
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-black tracking-wide italic">Dice Cuztomization</h3>
              </div>
              <div className="h-[2px] bg-white w-full opacity-90"></div>
            </div>

            {/* 🛠️ ส่วนแสดงผลลูกเต๋า 3 แถว พร้อมส่ง Props ส่องสถานะเปิด Ban คัดกรองตามเงื่อนไข */}
            <div className="flex flex-col gap-3">
              {['dice1', 'dice2', 'dice3'].map((rowKey, rowIndex) => {
                const currentFaces = diceData[rowKey as 'dice1' | 'dice2' | 'dice3'];
                return (
                  <div key={rowKey} className="relative flex items-center w-full">
                    <DiceDisplayRow 
                      rowLabel={`Dice ${String.fromCharCode(65 + rowIndex)}`}
                      diceFaces={currentFaces} 
                      onEditClick={() => handleOpenModal(rowKey)} 
                    />
                    
                    {/* ส่วนตรวจจับ Layer ปุ่มจิ้มเพื่อ Ban ครอบด้านบนเมื่อสวิตช์เปิดอยู่ */}
                    {firstTurn && (
                      <div className="absolute right-0 top-0 bottom-0 left-[85px] grid grid-cols-6 gap-1 px-1 py-1 pointer-events-auto">
                        {currentFaces.map((_, faceIdx) => {
                          const isBanned = banDice.row === rowKey && banDice.index === faceIdx;
                          return (
                            <button
                              key={faceIdx}
                              onClick={() => setBanDice({ row: rowKey, index: faceIdx })}
                              className={`w-full h-full rounded-md transition-all duration-200 ${
                                isBanned 
                                  ? 'border-4 border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,1)] bg-black/10' 
                                  : 'border-2 border-transparent hover:border-white/50 bg-transparent'
                              }`}
                              title="Click to ban this dice"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              
            </div>
            {/* วางเรียงกัน 3 แถว ส่ง Array 6 ตำแหน่ง และส่งฟังก์ชันเปิด Modal เข้าไป */}
            {/* <DiceDisplayRow 
              rowLabel="Dice A"
              diceFaces={diceData.dice1} 
              onEditClick={() => handleOpenModal('dice1')} 
            />
            <DiceDisplayRow 
              rowLabel="Dice B"
              diceFaces={diceData.dice2} 
              onEditClick={() => handleOpenModal('dice2')} 
            />
            <DiceDisplayRow 
              rowLabel="Dice C"
              diceFaces={diceData.dice3} 
              onEditClick={() => handleOpenModal('dice3')} 
            />
             */}
          </div>

          {/* Element Count */}
          <ElementCount diceData={diceData} />
          {/* 🛠️ ส่วนของ Modal (เขียนโค้ดดักไว้ท้ายไฟล์) */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
              <div className="bg-white text-black p-6 rounded-2xl max-w-md w-full border-4 border-black">
                <h2 className="text-xl font-black mb-4">Editing {selectedDiceRow}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-full bg-black text-white py-2 rounded-xl font-bold">Close / Save Changes</button>
              </div>
            </div>
          )}
        </div>

        {/* Controls (Add Skill, First Turn Toggle, Calculate) */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <button 
            onClick={() => setIsSkillModalOpen(true)}
            className="bg-black text-white text-xs font-black px-6 py-2 rounded-full border border-black hover:bg-neutral-800 transition active:scale-95 shadow-md"
          >
            Add Skill +
          </button>

          {/* First Turn Toggle (ทำแบบง่ายๆ ด้วย Checkbox + CSS ไปก่อน) */}
          <div className="bg-black text-white px-5 py-1.5 rounded-full flex items-center gap-3 shadow-md border border-black select-none">
            <span className="text-xs font-black italic tracking-wide">First Turn</span>
            
            {/* สวิตช์แอนิเมชันเปิด-ปิดแบบเลื่อนสมูท */}
            <button 
              onClick={() => setFirstTurn(!firstTurn)}
              className={`w-11 h-5.5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                firstTurn ? 'bg-[#500E5C]' : 'bg-[#939393]'
              }`}
            >
              <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-300 ${
                firstTurn ? 'translate-x-5.5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <button 
            onClick={handleCalculate}
            className="bg-black text-white text-xs font-black px-7 py-2 rounded-full border border-black hover:bg-neutral-800 transition active:scale-95 shadow-md uppercase tracking-wider"
          >
            Calculate
          </button>
        </div>

        

        {/* Skill Cards List  */}
        <div className="flex flex-col gap-4">
          {/* ตัวอย่างการ Loop Card โล่งๆ รอไว้ 5 ใบ */}
          
          
          <div className="flex justify-center mt-4">
             <button className="bg-[#1e1e1e] text-white text-xs px-4 py-1 rounded-full">View more</button>
          </div>
        </div>

        <PokemonSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          currentPokemonId={pokemonId} // 🌟 ส่ง ID ปัจจุบันไปตรวจสอบความซ้ำซ้อน
          onSelectPokemon={(newId, shouldResetDice) => {
            setPokemonId(newId);
            
            // 🌟 เงื่อนไขถ้าสั่งรีเซ็ตลูกเต๋า (กรณีเลือกตัวละครเดิมซ้ำแล้วกด Continue)
            if (shouldResetDice) {
              setDiceData({
                dice1: [1, 2, 3, 4, 5, 6],
                dice2: [1, 2, 3, 4, 5, 6],
                dice3: [1, 2, 3, 4, 5, 6],
              });
              console.log("Dice set has been reset to default due to same pokemon re-selection.");
            }
            setIsSidebarOpen(false);
          }} 
        />

      </div>
    </div>
  );
}
