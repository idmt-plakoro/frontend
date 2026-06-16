// components/SkillModal.tsx
"use client";
import React, { useState } from 'react';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonId: number;
  currentSkill: any;
  onSave: (updatedSkill: any) => void;
}

export default function SkillModal({ isOpen, onClose, pokemonId, currentSkill, onSave }: SkillModalProps) {
  // สร้าง State จำลองข้อมูลสกิลภายใน Modal
  const [skillName, setSkillName] = useState(currentSkill?.name || '');
  const [damage, setDamage] = useState(currentSkill?.damage || 20);

  if (!isOpen) return null;

  const handleSave = () => {
    // ส่งข้อมูลสกิลที่แก้ไขกลับไปอัปเดตที่หน้า Dashboard แม่
    onSave({ name: skillName, damage: Number(damage) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black p-6 rounded-2xl max-w-md w-full border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-fadeIn">
        <h2 className="text-xl font-black mb-1 uppercase tracking-wide">Skill Customization</h2>
        <p className="text-xs text-gray-500 mb-4">Editing skills for Pokemon ID: {pokemonId}</p>
        
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Skill Name</label>
            <input 
              type="text" 
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Flamethrower"
              className="w-full border-2 border-black p-2 rounded-lg text-sm font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Base Damage</label>
            <input 
              type="number" 
              value={damage}
              onChange={(e) => setDamage(e.target.value)}
              className="w-full border-2 border-black p-2 rounded-lg text-sm font-bold"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-black py-2.5 rounded-xl font-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-gray-300 transition"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-yellow-400 text-black py-2.5 rounded-xl font-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-yellow-500 transition"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}