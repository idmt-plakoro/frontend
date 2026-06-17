"use client";

import React, { useEffect, useState } from "react";
import PokemonProfile from "./PokemonProfile";
import PokemonSidebar from "./PokemonSidebar";
import CardBox, { SkillCard } from "./CardBox";
import {
  getApiPokemonByPokemonId,
  getApiFaceTypes,
  getApiExampleTypes,
} from "@/src/api/generated/sdk.gen";
import ElementCount from "./ElementCount";
import { client } from "@/src/api/generated/client.gen";
import DiceCustomizationModal from "./Modals/DiceCustomizationModal";
import DiceCustomization from "./DiceCustomization";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  STORAGE_KEYS,
} from "@/libs/storage";
import ErrorModal from "./Modals/ErrorModal";
import { validateDiceConfig, calculateCardProbability } from "@/libs/calculate";
import SkillModal from "./Modals/SkillModal";
import ShareModal from "./Modals/ShareModal";
import { canShare, encodeConfig } from "@/libs/share";
import { GetApiExampleTypesResponse } from "@/src/api/generated";

client.setConfig({
  baseUrl: "http://localhost:3000",
});

export default function Dashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [pokemonId, setPokemonId] = useState<number>(1);

  const [pokemonInfo, setPokemonInfo] = useState<any>(null);
  const [cards, setCards] = useState<SkillCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [faceTypesList, setFaceTypesList] = useState<any[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [isDiceLoaded, setIsDiceLoaded] = useState(false);
  const [diceData, setDiceData] = useState<{
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  }>({
    dice1: [null, null, null, null, null, null],
    dice2: [null, null, null, null, null, null],
    dice3: [null, null, null, null, null, null],
  });

  // State สำหรับควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State สำหรับจำว่ากำลังกดแก้ไขลูกเต๋าแถวไหนอยู่ (dice1, dice2, หรือ dice3)
  const [selectedDiceRow, setSelectedDiceRow] = useState<string | null>(null);

  // 🌟 State สำหรับ Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState<boolean>(false);
  const [savedSkillIds, setSavedSkillIds] = useState<number[]>([]); // เก็บ int array 5 ช่อง

  const [firstTurn, setFirstTurn] = useState<boolean>(false);

  // โครงสร้างเก็บข้อมูลลูกเต๋าที่โดนแบน บังคับ Default เป็น แถวที่ 3 ลูกแรก (index: 0)
  const [banDice, setBanDice] = useState<{ row: string; index: number }>({
    row: "dice3",
    index: 0,
  });

  // Error Modal State
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Probability Calculation State
  const [cardChances, setCardChances] = useState<Record<number, number>>({});

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  const [types, setTypes] = useState<GetApiExampleTypesResponse["data"]>([]);

  useEffect(() => {
    getApiExampleTypes().then((resType) => {
      const data = resType.data?.data;
      if (data) {
        setTypes(data);
      }
    });
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchNewPokemon() {
      setLoading(true);
      try {
        console.log("Fetching data for Pokemon ID:", pokemonId);
        const response = await getApiPokemonByPokemonId({
          path: {
            pokemonId: pokemonId,
          },
        });
        if (active) {
          setCards(response.data?.data?.skillCards || []);
          setPokemonInfo(response.data?.data);
        }
      } catch (error) {
        console.error("Failed to fetch pokemon data:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchNewPokemon();
    return () => {
      active = false;
    };
  }, [pokemonId]);

  useEffect(() => {
    async function fetchFaceTypes() {
      try {
        const response = await getApiFaceTypes();
        if (response.data?.success) {
          setFaceTypesList(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch face types:", error);
      }
    }
    fetchFaceTypes();
  }, []);

  // Load all configurations from localStorage after hydration
  useEffect(() => {
    const savedDice = getLocalStorageItem(STORAGE_KEYS.DICE_DATA, null);
    if (savedDice) {
      setDiceData(savedDice);
    }
    const savedPokemonId = getLocalStorageItem(STORAGE_KEYS.POKEMON_ID, null);
    if (savedPokemonId) {
      setPokemonId(savedPokemonId);
    }
    const savedSkills = getLocalStorageItem<any>(
      STORAGE_KEYS.CURRENT_SKILL,
      null,
    );
    if (Array.isArray(savedSkills)) {
      setSavedSkillIds(savedSkills.filter((id: any) => typeof id === "number"));
    } else {
      setSavedSkillIds([]);
    }
    const savedFirstTurn = getLocalStorageItem("plakoro_first_turn", null);
    if (savedFirstTurn !== null) {
      setFirstTurn(savedFirstTurn);
    }
    const savedBanDice = getLocalStorageItem("plakoro_ban_dice", null);
    if (savedBanDice) {
      setBanDice(savedBanDice);
    }
    setIsDiceLoaded(true);
  }, []);

  // Save changes only after initial load from localStorage is complete
  useEffect(() => {
    if (isDiceLoaded) {
      setLocalStorageItem(STORAGE_KEYS.DICE_DATA, diceData);
    }
  }, [diceData, isDiceLoaded]);

  useEffect(() => {
    if (isDiceLoaded) {
      setLocalStorageItem(STORAGE_KEYS.POKEMON_ID, pokemonId);
    }
  }, [pokemonId, isDiceLoaded]);

  useEffect(() => {
    if (isDiceLoaded) {
      setLocalStorageItem(STORAGE_KEYS.CURRENT_SKILL, savedSkillIds);
    }
  }, [savedSkillIds, isDiceLoaded]);

  useEffect(() => {
    if (isDiceLoaded) {
      setLocalStorageItem("plakoro_first_turn", firstTurn);
    }
  }, [firstTurn, isDiceLoaded]);

  useEffect(() => {
    if (isDiceLoaded) {
      setLocalStorageItem("plakoro_ban_dice", banDice);
    }
  }, [banDice, isDiceLoaded]);

  // 🌟 Sanitize savedSkillIds when pokemonInfo changes to prevent stale skill IDs from another Pokemon
  useEffect(() => {
    if (
      pokemonInfo &&
      pokemonInfo.id === pokemonId &&
      pokemonInfo.skillCards &&
      savedSkillIds.length > 0
    ) {
      const validIds = savedSkillIds.filter((id) =>
        pokemonInfo.skillCards.some((card: any) => card.id === id),
      );
      if (validIds.length !== savedSkillIds.length) {
        setSavedSkillIds(validIds);
      }
    }
  }, [pokemonInfo, pokemonId, savedSkillIds]);

  const handleChangePokemon = (newId: number) => {
    setPokemonId(newId); // พอสั่งเปลี่ยน ID ปุ๊บ useEffect ข้างบนจะทำงานอัตโนมัติทันที!
    setSavedSkillIds([]);
    setCardChances({});
  };

  const handleOpenModal = (rowName: string) => {
    setSelectedDiceRow(rowName);
    setIsModalOpen(true);
  };

  const handleSaveDice = (updatedFaces: (number | null)[]) => {
    if (selectedDiceRow) {
      setDiceData((prev) => ({
        ...prev,
        [selectedDiceRow]: updatedFaces,
      }));
    }
    setIsModalOpen(false);
  };

  // 🌟 ฟังก์ชันบันทึกข้อมูลหลังจากกดเซฟใน SkillModal
  const handleConfirmSkills = (newSkillSave: number[]) => {
    setSavedSkillIds(newSkillSave); // รับค่า Array ID มาแทนที่อันเดิม
    console.log("Skills saved to array:", newSkillSave);
    setCardChances((prev) => {
      const updated: Record<number, number> = {};
      newSkillSave.forEach((id) => {
        if (id in prev) {
          updated[id] = prev[id];
        }
      });
      return updated;
    });
  };

  // 🌟 ฟังก์ชันคำนวณหลังกดปุ่ม Calculate
  const handleCalculate = () => {
    console.log("--- Starting Calculation Process ---");
    const isValid = validateDiceConfig(diceData);
    if (!isValid) {
      setErrorTitle("Incomplete Dice Configuration");
      setErrorMessage(
        "Please make sure all 3 dice have 6 faces configured before calculating.",
      );
      setIsErrorOpen(true);
      return;
    }

    // Calculate probabilities for each card
    const normalType = types?.find(
      (t) => t.enName === "Normal" || t.thName === "ไร้สี",
    );
    const normalTypeId = normalType?.id ?? 11;

    const chances: Record<number, number> = {};
    savedSkillIds.forEach((id) => {
      const card = cards.find((c) => c.id === id);
      if (card) {
        chances[id] = calculateCardProbability(
          card,
          diceData,
          firstTurn,
          banDice.row,
          faceTypesList,
          normalTypeId,
        );
      }
    });
    setCardChances(chances);
  };

  const handleShare = () => {
    const check = canShare(diceData);
    if (!check.canShare) {
      setErrorTitle("Cannot Share");
      setErrorMessage(
        check.reason || "Please complete configuration before sharing.",
      );
      setIsErrorOpen(true);
      return;
    }

    const shareData = {
      pokemonId,
      diceData,
      savedSkillIds,
      firstTurn,
      banDice,
    };
    const base64Data = encodeConfig(shareData);
    const url = `${window.location.origin}/share?data=${base64Data}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
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
            <button
              onClick={handleShare}
              className="bg-yellow-300 font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
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
          <div
            className="w-full md:w-55 max-w-62.5 rounded-xl p-2 
          flex flex-col items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(true);
            }}
          >
            <PokemonProfile
              ImgSrc={pokemonInfo?.pokemonImage}
              HP={pokemonInfo?.hp}
              Type={pokemonInfo?.typeId}
              WeaknessType={pokemonInfo?.weaknessTypeId}
            />
          </div>

          {/* Dice Customization */}
          <DiceCustomization
            diceData={diceData}
            firstTurn={firstTurn}
            banDice={banDice}
            setBanDice={setBanDice}
            faceTypesList={faceTypesList}
            onEditClick={handleOpenModal}
          />

          {/* Element Count */}
          <ElementCount diceData={diceData} />
          {/* 🛠️ ส่วนของ Modal (เขียนโค้ดดักไว้ท้ายไฟล์) */}
          <DiceCustomizationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedDiceRow={selectedDiceRow}
            diceFaces={
              selectedDiceRow
                ? diceData[selectedDiceRow as "dice1" | "dice2" | "dice3"]
                : []
            }
            diceData={diceData}
            pokemonInfo={pokemonInfo}
            faceTypesList={faceTypesList}
            onSave={handleSaveDice}
          />
          <ErrorModal
            title={errorTitle}
            content={errorMessage}
            isOpen={isErrorOpen}
            onClose={() => setIsErrorOpen(false)}
          />

          {/* 🌟 เรียกใช้ SkillModal ตรงนี้ */}
          <SkillModal
            isOpen={isSkillModalOpen}
            onClose={() => setIsSkillModalOpen(false)}
            skillCards={cards}
            oldSkillSave={savedSkillIds} // ส่ง array ID ที่จำไว้กลับเข้าไป
            onConfirm={handleConfirmSkills} // รอรับ array ID อันใหม่
          />
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            shareUrl={shareUrl}
          />
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
            <span className="text-xs font-black italic tracking-wide">
              First Turn
            </span>

            {/* สวิตช์แอนิเมชันเปิด-ปิดแบบเลื่อนสมูท */}
            <button
              onClick={() => setFirstTurn(!firstTurn)}
              className={`w-11 h-5.5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                firstTurn ? "bg-[#500E5C]" : "bg-[#939393]"
              }`}
            >
              <div
                className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-300 ${
                  firstTurn ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleCalculate}
            className="bg-black text-white text-xs font-black px-7 py-2 rounded-full border border-black hover:bg-neutral-800 transition active:scale-95 shadow-md tracking-wider"
          >
            Calculate
          </button>
        </div>

        {/* Skill Cards */}
        {savedSkillIds?.map((id) => {
          const card = cards.find((c) => c.id === id);
          const chance = cardChances[id] ?? 0;
          return <CardBox key={id} card={card} type={types} chance={chance} />;
        })}

        {children}

        <PokemonSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPokemonId={pokemonId} // 🌟 ส่ง ID ปัจจุบันไปตรวจสอบความซ้ำซ้อน
          onSelectPokemon={(newId, shouldReset) => {
            setPokemonId(newId);
            setSavedSkillIds([]);
            // 🌟 เงื่อนไขถ้าสั่งรีเซ็ตลูกเต๋า (กรณีเลือกตัวละครเดิมซ้ำแล้วกด Continue)

            setDiceData({
              dice1: [null, null, null, null, null, null],
              dice2: [null, null, null, null, null, null],
              dice3: [null, null, null, null, null, null],
            });
            setCardChances({});
            console.log(
              "Dice set has been reset to default due to same pokemon re-selection.",
            );

            setIsSidebarOpen(false);
          }}
        />
      </div>
    </div>
  );
}
