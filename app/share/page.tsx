"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeConfig, validateShareData } from "@/libs/share";
import { setLocalStorageItem, STORAGE_KEYS } from "@/libs/storage";

function ShareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base64Data = searchParams.get("data");
    if (!base64Data) {
      setError("No share data found in the URL.");
      return;
    }

    const decoded = decodeConfig(base64Data);
    if (!decoded || !validateShareData(decoded)) {
      setError("The share URL is invalid, expired, or malformed.");
      return;
    }

    // Save configuration states to localStorage with fallback for optional fields
    const savedSkillIds = Array.isArray(decoded.savedSkillIds) && decoded.savedSkillIds.every((id: any) => typeof id === "number") ? decoded.savedSkillIds : [];
    const firstTurn = typeof decoded.firstTurn === "boolean" ? decoded.firstTurn : false;
    const banDice = decoded.banDice && typeof decoded.banDice.row === "string" && typeof decoded.banDice.index === "number" ? decoded.banDice : { row: "dice3", index: 0 };

    setLocalStorageItem(STORAGE_KEYS.DICE_DATA, decoded.diceData);
    setLocalStorageItem(STORAGE_KEYS.POKEMON_ID, decoded.pokemonId);
    setLocalStorageItem(STORAGE_KEYS.CURRENT_SKILL, savedSkillIds);
    setLocalStorageItem("plakoro_first_turn", firstTurn);
    setLocalStorageItem("plakoro_ban_dice", banDice);

    // Redirect to root dashboard page
    router.replace("/");
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 font-salsa">
        <div className="bg-[#222222] border-2 border-red-500 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-black text-red-500 mb-2">Invalid Share Link</h1>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => router.replace("/")}
            className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-98 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 font-salsa">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold tracking-wide mt-2">Restoring dice configuration...</h2>
        <p className="text-neutral-400 text-xs">Please wait, you will be redirected shortly.</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 font-salsa">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-bold tracking-wide mt-2">Loading...</h2>
          </div>
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
