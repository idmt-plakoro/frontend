"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  getApiSlots,
  GetApiSlotsBySlotNumberResponse,
  GetAuthAccountResponse,
  postApiSlots,
  putApiSlotsBySlotNumber,
} from "@/src/api/generated";
import { getAuthAccountCached } from "@/libs/authCache";
import Button from "../Button";
import { setLocalStorageItem, STORAGE_KEYS } from "@/libs/storage";

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
  const [savedData, setSavedData] = useState<
    GetApiSlotsBySlotNumberResponse["data"][] | null
  >(null);

  const [name, setName] = useState("");
  const [numberSlot, setNumberSlot] = useState<number | null>(null);
  const [toggleFetched, setToggleFetched] = useState(false);

  useEffect(() => {
    try {
      if (!user) {
        getAuthAccountCached().then((res) => {
          if (res.data?.success) {
            user = res.data.data;
          } else {
            onClose();
          }
        });
      }
      getApiSlots().then((res) => {
        if (res.data?.success) {
          setSavedData(res.data.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [toggleFetched]);

  const handleSaveSlot = () => {
    if (!name || !numberSlot) {
      alert("Please enter a name and choose a slot to save.");
      return;
    }
    try {
      if (
        savedData &&
        savedData.find((slot) => slot.slotNumber === numberSlot)
      ) {
        putApiSlotsBySlotNumber({
          body: {
            dice1:
              data.diceData.dice1?.filter((v): v is number => v !== null) ?? [],
            dice2:
              data.diceData.dice2?.filter((v): v is number => v !== null) ?? [],
            dice3:
              data.diceData.dice3?.filter((v): v is number => v !== null) ?? [],
            slotName: name,
            pokemonId: data.pokemonId,
            skills: data.savedSkillIds,
          },
          path: {
            slotNumber: numberSlot.toString(),
          },
        }).then(() => {
          setToggleFetched(!toggleFetched);
          setLocalStorageItem(STORAGE_KEYS.SLOT_NAME, name);
          onSave?.(name);
          onClose();
        });
      } else {
        postApiSlots({
          body: {
            dice1:
              data.diceData.dice1?.filter((v): v is number => v !== null) ?? [],
            dice2:
              data.diceData.dice2?.filter((v): v is number => v !== null) ?? [],
            dice3:
              data.diceData.dice3?.filter((v): v is number => v !== null) ?? [],
            slotNumber: numberSlot,
            slotName: name,
            pokemonId: data.pokemonId,
            skills: data.savedSkillIds,
          },
        }).then(() => {
          setToggleFetched(!toggleFetched);
          setLocalStorageItem(STORAGE_KEYS.SLOT_NAME, name);
          onSave?.(name);
          onClose();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button
        onClick={onClose}
        className="text-white cursor-pointer hover:scale-110 transition-transform text-2xl pr-2 duration-150 text-bold absolute top-2 right-2"
        title="Close"
      >
        ✕
      </button>
      <div className="flex flex-col gap-3">
        <p className="self-center text-center text-xl">
          Save This Customization
        </p>
        <div className="flex gap-2">
          <p className="self-center text-start text-md"> Pokemon </p>
          <p className="bg-white rounded-full text-black px-2">
            {data?.pokemonName}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="self-center text-start text-md">Name</p>
          <input
            type="text"
            className="bg-white rounded-full text-black px-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <p className="self-center text-start text-md">Choose Slot To Save</p>
        <div className="grid grid-row-5 justify-center gap-1 text-black px-2">
          {Array.from({ length: 5 }, (_, i) => {
            const slotNumber = i + 1;
            const slot = savedData?.find((s) => s.slotNumber === slotNumber);
            const displayNumber = slot?.slotName || "Empty";
            const isSelected = numberSlot === slotNumber;

            return (
              <button
                key={slotNumber}
                onClick={() => setNumberSlot(slotNumber)}
                className={`w-auto rounded-full text-black px-2 ${isSelected ? "bg-white/70" : "bg-white"} hover:bg-white/70 cursor-pointer drop-shadow-md/30`}
              >
                {slotNumber} : {displayNumber}
              </button>
            );
          })}
        </div>
        <Button
          func={handleSaveSlot}
          text="Save"
          className="bg-yellow-300 drop-shadow-md/50 text-black self-end"
        />
      </div>
    </Modal>
  );
}
