"use client"; 

import React, { useState } from 'react';
import PokemonProfile from './PokemonProfile';
import DiceDisplayRow from './DiceDisplayRow';
import { PokemonFullSet } from '@/interface';


interface DashboardClientProps {
  PokemonData: PokemonFullSet; 
}

export default function DashboardClient({ PokemonData }: DashboardClientProps) {
  // รับข้อมูลมาจาก Server Component ข้างบน
  const pokemonInfo = PokemonData;

  // State สำหรับลูกเต๋าและการควบคุม Modal (ใช้งานได้ร้อยเปอร์เซ็นต์แล้ว)
  const [diceData, setDiceData] = useState({
    dice1: [1, 2, 3, 4, 5, 6],
    dice2: [2, 2, 4, 4, 1, 1],
    dice3: [6, 6, 6, 3, 3, 2],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiceRow, setSelectedDiceRow] = useState<string | null>(null);

  const handleOpenModal = (rowName: string) => {
    setSelectedDiceRow(rowName);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen p-8 bg-gray-200 flex justify-center">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-8 flex flex-col gap-8">
        
        {/* โซน 2.1: Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black bg-[#1a1a1a] text-yellow-400 px-6 py-2 rounded-full border-2 border-yellow-400 shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
            Plakoro First Dice set
          </h1>
        </div>

        {/* โซน 2.2: โซนเนื้อหาหลัก */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
          
          {/* 2.2.1 Pokemon Profile */}
          <div className="flex-1 w-full">
            <PokemonProfile 
              ImgSrc={pokemonInfo?.pokemonImage}
              HP={pokemonInfo?.hp}
              Type={pokemonInfo?.typeId}
              WeaknessType={pokemonInfo?.weaknessTypeId}
            />
          </div>

          {/* 2.2.2 Dice Customization */}
          <div className="flex-1 w-full min-h-[150px] bg-[#2a2a2a] text-white rounded-2xl p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col gap-3">
            <h3 className="text-sm font-black text-center text-yellow-400 tracking-wider mb-1 uppercase">
              Dice Customization
            </h3>
            
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

        </div>

        {/* 🛠️ ส่วนของ Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-black p-6 rounded-2xl max-w-md w-full border-4 border-black shadow-[8px_8px_0_0_rgba(250,204,21,1)]">
              <h2 className="text-xl font-black mb-4">Editing {selectedDiceRow}</h2>
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
    </div>
  );
}