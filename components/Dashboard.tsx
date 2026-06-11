
import React from 'react';
import getPokemonList from '@/libs/getPokemonList';
import getPokemonData from '@/libs/getPokemonData';
import PokemonProfile from './PokemonProfile';

export default async function Dashboard() {
  const response = await getPokemonData(6)
  const pokemonInfo = response.data;
  if(!pokemonInfo) {
    console.log('no pokemonInfo')
  }

  console.log(pokemonInfo);
  return (
    // Background ลายลูกเต๋า (สมมติว่าเป็นสีเทาอ่อนไปก่อน)
    <div className="min-h-screen p-8 bg-gray-200 flex justify-center">
      
      {/* กล่อง Container สีขาวหลัก */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
        
        {/* Header (Title + Share/Save Button) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black bg-[#1a1a1a] text-yellow-400 px-6 py-2 rounded-full border-2 border-yellow-400 shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
            Plakoro First Dice set
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
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        
          {/* Pokemon Profile */}
          <div className="flex-1 min-h-[150px] bg-white border-2 border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center">
             <PokemonProfile 
                  ImgSrc={pokemonInfo.pokemonImage} 
                  HP={pokemonInfo.hp} 
                  Type={pokemonInfo.typeId} 
                  WeaknessType={pokemonInfo.weaknessTypeId}
                />
          </div>

          {/* Dice Customization */}
          <div className="flex-1 min-h-[150px] bg-[#2a2a2a] text-white rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2 text-center">Dice Customization</h3>
            {/* กล่องลูกเต๋าสีเหลือง/แดง */}
            <div className="text-xs text-gray-400 text-center">[Grid ลูกเต๋า]</div>
          </div>

          {/* Element Count */}
          <div className="flex-1 min-h-[150px] bg-[#2a2a2a] text-white rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2 text-center border-b border-gray-600 pb-2">Element Count</h3>
            {/* สรุปธาตุ */}
            <div className="text-xs text-gray-400 text-center mt-4">[รายการธาตุ]</div>
          </div>
        </div>

        {/* Controls (Add Skill, First Turn Toggle, Calculate) */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <button className="bg-[#2a2a2a] text-white text-sm px-6 py-2 rounded-full hover:bg-black transition">
            Add Skill +
          </button>

          {/* First Turn Toggle (ทำแบบง่ายๆ ด้วย Checkbox + CSS ไปก่อน) */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#2a2a2a] text-white text-sm px-4 py-2 rounded-full">
            <span>First Turn</span>
            <input type="checkbox" className="toggle-checkbox" />
          </label>

          <button className="bg-[#2a2a2a] text-white text-sm px-6 py-2 rounded-full hover:bg-black transition">
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
             <button className="bg-[#2a2a2a] text-white text-xs px-4 py-1 rounded-full">View more</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Component สำหรับ Card โล่งๆ ในโซน 2.4 (สร้างแยกออกมาเพื่อให้เรียกใช้ซ้ำได้)
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