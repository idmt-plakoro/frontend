"use client";

import React, { useEffect, useState } from 'react';
import getPokemonData from '@/libs/getPokemonData';
import PokemonProfile from './PokemonProfile';
import DiceDisplayRow from './DiceDisplayRow';
import PokemonSidebar from './PokemonSidebar';
import { getApiPokemonByPokemonId } from '@/src/api/generated/sdk.gen';
import ElementCount from './ElementCount';


export default function Dashboard() {

  const [pokemonId, setPokemonId] = useState<number>(6);
  
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
        console.log("กำลังFetching data for Pokemon ID:", pokemonId);
        const response = await getApiPokemonByPokemonId({  path: {
            pokemonId: pokemonId,
          },
        });
        setPokemonInfo(response.data); // เซ็ตข้อมูลเข้า State
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
           onClick={() => setIsSidebarOpen(true)} >
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

            {/* วางเรียงกัน 3 แถว ส่ง Array 6 ตำแหน่ง และส่งฟังก์ชันเปิด Modal เข้าไป */}
            <DiceDisplayRow 
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
            
          </div>

          {/* Element Count */}
          <ElementCount diceData={diceData} />
          {/* 🛠️ ส่วนของ Modal (เขียนโค้ดดักไว้ท้ายไฟล์) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white text-black p-6 rounded-2xl max-w-md w-full border-4 border-black shadow-[8px_8px_0_0_rgba(250,204,21,1)]">
              <h2 className="text-xl font-black mb-4">Editing {selectedDiceRow}</h2>
              <p className="text-sm text-gray-600 mb-6">คุณสามารถเปลี่ยนข้อมูลธาตุในลูกเต๋าแถวนี้ได้ที่นี่...</p>
              
              {/* ปุ่มปิด Modal ชั่วคราว */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-black text-white py-2 rounded-xl font-bold hover:bg-gray-800"
              >
                Close / Save Changes
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Controls (Add Skill, First Turn Toggle, Calculate) */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <button className="bg-[#1e1e1e] text-white text-sm px-6 py-2 rounded-full hover:bg-black transition">
            Add Skill +
          </button>

          {/* First Turn Toggle (ทำแบบง่ายๆ ด้วย Checkbox + CSS ไปก่อน) */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#1e1e1e] text-white text-sm px-4 py-2 rounded-full">
            <span>First Turn</span>
            <input type="checkbox" className="toggle-checkbox" />
          </label>

          <button className="bg-[#1e1e1e] text-white text-sm px-6 py-2 rounded-full hover:bg-black transition">
            Calculate
          </button>
        </div>

        {/* Skill Cards List  */}
        <div className="flex flex-col gap-4">
          {/* ตัวอย่างการ Loop Card โล่งๆ รอไว้ 5 ใบ */}
          {/* {pokemonInfo.skillCards.map((skill) => (
             // สร้าง Component ใหม่ชื่อ SkillCardItem มารับค่า props ไปโชว์
             // (อย่าลืมส่ง key ให้ React ด้วย)
            //  <SkillCardItem key={skill.id} skillData={skill} />
            
          ))
          } */}
          
          <div className="flex justify-center mt-4">
             <button className="bg-[#1e1e1e] text-white text-xs px-4 py-1 rounded-full">View more</button>
          </div>
        </div>

        <PokemonSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onSelectPokemon={(newId) => {
            setPokemonId(newId);      // เปลี่ยน ID โปเกมอนหน้า Dashboard แม่
            setIsSidebarOpen(false);  // ปิด Sidebar ทันทีที่เลือกเสร็จ
          }} 
        />

      </div>
    </div>
  );
}

// Component Card โล่งๆ ตัวอย่าง
function EmptySkillCard() {
  return (
    <div className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center p-4 shadow-sm hover:shadow-md transition">
      <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4 animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
      <div className="w-24 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
    </div>
  );
}