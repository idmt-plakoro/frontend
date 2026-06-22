"use client";
import { useEffect, useState } from "react";
import {
  getApiSlots,
  GetApiSlotsBySlotNumberResponse,
  GetAuthAccountResponse,
  postApiSlots,
  putApiSlotsBySlotNumber,
} from "@/src/api/generated";
import { setLocalStorageItem, STORAGE_KEYS } from "@/libs/storage";
import { useTranslation } from "react-i18next";

export default function SaveModal({
  isOpen,
  onClose,
  onSave,
  user,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (slotName: string) => void;
  user: GetAuthAccountResponse["data"] | null;
  data: {
    pokemonName: string;
    pokemonId: number;
    diceData: {
      dice1: (number | null)[];
      dice2: (number | null)[];
      dice3: (number | null)[];
    };
    savedSkillIds: number[];
  };
}) {
  const { t } = useTranslation();

  const [savedData, setSavedData] = useState<
    GetApiSlotsBySlotNumberResponse["data"][] | null
  >(null);

  const [name, setName] = useState("");
  const [numberSlot, setNumberSlot] = useState<number | null>(1); // Default to slot 1
  const [toggleFetched, setToggleFetched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getApiSlots().then((res) => {
        if (res.data?.success) {
          const slots = res.data.data || [];
          setSavedData(slots);

          // Find slot 1 by default to pre-fill the name if name is empty
          if (numberSlot === null) {
            setNumberSlot(1);
            const slot1 = slots.find((s) => s.slotNumber === 1);
            if (slot1?.slotName) {
              setName(slot1.slotName);
            } else {
              setName("");
            }
          } else {
            // Pre-fill name for the active selection if it has a saved name
            const currentSlot = slots.find((s) => s.slotNumber === numberSlot);
            if (currentSlot?.slotName) {
              setName(currentSlot.slotName);
            }
          }
        }
      }).catch((err) => {
        console.error("Error fetching slots:", err);
      });
    }
  }, [isOpen, toggleFetched]);

  const handleSlotClick = (slotNumber: number) => {
    setNumberSlot(slotNumber);
    const slot = savedData?.find((s) => s.slotNumber === slotNumber);
    if (slot) {
      setName(slot.slotName || "");
    } else {
      setName("");
    }
  };

  const handleSaveSlot = () => {
    if (!name.trim()) {
      alert("Please enter a name to save.");
      return;
    }
    if (numberSlot === null) {
      alert("Please select a slot.");
      return;
    }
    try {
      const existingSlot = savedData?.find((s) => s.slotNumber === numberSlot);
      const isUpdate = !!existingSlot;

      const savePayload = {
        dice1: data.diceData.dice1?.filter((v): v is number => v !== null) ?? [],
        dice2: data.diceData.dice2?.filter((v): v is number => v !== null) ?? [],
        dice3: data.diceData.dice3?.filter((v): v is number => v !== null) ?? [],
        slotName: name,
        pokemonId: data.pokemonId,
        skills: data.savedSkillIds,
      };

      const savePromise = isUpdate
        ? putApiSlotsBySlotNumber({
            body: savePayload,
            path: {
              slotNumber: numberSlot.toString(),
            },
          })
        : postApiSlots({
            body: {
              ...savePayload,
              slotNumber: numberSlot,
            },
          });

      savePromise.then(() => {
        setToggleFetched(!toggleFetched);
        setLocalStorageItem(STORAGE_KEYS.SLOT_NAME, name);
        onSave?.(name);
        onClose();
      }).catch((err) => {
        console.error("Error saving slot:", err);
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center w-screen h-screen font-salsa pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 pointer-events-auto cursor-default"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#131313]/95 border-[3px] border-[#ecc45a] w-[95vw] max-w-[850px] rounded-[24px] px-6 py-5 sm:px-8 sm:py-6 shadow-2xl flex flex-col md:flex-row items-center gap-6 justify-between text-white pointer-events-auto z-10 font-salsa select-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white hover:text-gray-300 transition-transform hover:scale-110 text-3xl font-light cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>

        {/* Input Bar Section */}
        <div className="relative flex items-center w-full md:flex-1 pt-4 md:pt-0">
          <input
            type="text"
            className="w-full bg-white text-black pl-6 pr-28 py-3 rounded-full text-lg font-bold outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-2 border-transparent focus:border-[#ecc45a] transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("slot.name") || "Enter slot name..."}
          />
          <button
            onClick={handleSaveSlot}
            className="absolute right-1.5 bg-black text-white hover:bg-neutral-800 active:scale-95 transition-all px-6 py-2 rounded-full text-base font-black cursor-pointer shadow-md border border-transparent"
          >
            {t("button.save") || "Save"}
          </button>
        </div>

        {/* Slots Stack Section */}
        <div className="flex flex-col gap-1.5 w-full md:w-32 min-w-[130px] pt-2 md:pt-4 pb-2">
          {Array.from({ length: 5 }, (_, i) => {
            const slotNumber = i + 1;
            const isSelected = numberSlot === slotNumber;
            const slot = savedData?.find((s) => s.slotNumber === slotNumber);
            const isSaved = !!slot;

            return (
              <button
                key={slotNumber}
                onClick={() => handleSlotClick(slotNumber)}
                className={`w-full py-1.5 rounded-full text-center font-black text-sm border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative select-none
                  ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white text-black hover:bg-gray-100 border-black"
                  }`}
              >
                {t("slot.slotNumber", { number: slotNumber })}
                {isSaved && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 border border-black rounded-full shadow-sm animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
