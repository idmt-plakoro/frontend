// app/collections/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getApiSlots,
  getApiPokemonList,
  deleteApiSlotsBySlotNumber,
  getApiFaceTypes,
} from "@/src/api/generated";
import Face from "@/components/Face";
import { setLocalStorageItem, STORAGE_KEYS } from "@/libs/storage";

// ─── Type Styles (mirrors PokemonSidebar) ───────────────────────────────────
const TYPE_STYLES: Record<
  number,
  { label: string; bg: string; text: string; pill: string }
> = {
  1: {
    label: "Grass",
    bg: "#22c55e",
    text: "#14532d",
    pill: "bg-[#22c55e] text-[#14532d]",
  },
  2: {
    label: "Fire",
    bg: "#ef4444",
    text: "#fff",
    pill: "bg-[#ef4444] text-white",
  },
  3: {
    label: "Water",
    bg: "#00c2ff",
    text: "#fff",
    pill: "bg-[#00c2ff] text-white",
  },
  4: {
    label: "Electric",
    bg: "#ffcc00",
    text: "#422006",
    pill: "bg-[#ffcc00] text-[#422006]",
  },
  5: {
    label: "Psychic",
    bg: "#ec4899",
    text: "#fff",
    pill: "bg-[#ec4899] text-white",
  },
  6: {
    label: "Fighting",
    bg: "#b45309",
    text: "#fff",
    pill: "bg-[#b45309] text-white",
  },
  7: {
    label: "Dark",
    bg: "#007598",
    text: "#fff",
    pill: "bg-[#007598] text-white",
  },
  8: {
    label: "Steel",
    bg: "#6b7280",
    text: "#fff",
    pill: "bg-[#6b7280] text-white",
  },
  9: {
    label: "Dragon",
    bg: "#78716c",
    text: "#fff",
    pill: "bg-[#78716c] text-white",
  },
  10: {
    label: "Flying",
    bg: "#38bdf8",
    text: "#fff",
    pill: "bg-[#38bdf8] text-white",
  },
  11: {
    label: "Normal",
    bg: "#a3a3a3",
    text: "#fff",
    pill: "bg-[#a3a3a3] text-white",
  },
};

// type pill order (ALL + same order as PokemonSidebar)
const TYPE_FILTER_ORDER = [2, 11, 1, 4, 5, 7, 8, 10, 9, 3];

// ─── Slot data type from API ──────────────────────────────────────────────────
interface SlotData {
  id: string;
  slotNumber: number;
  slotName?: string | null;
  pokemonId: number;
  updatedAt?: string | null;
  dice1: number[];
  dice2: number[];
  dice3: number[];
  skills?: number[] | null;
}

interface PokemonInfo {
  id: number;
  enPokemonName?: string | null;
  thPokemonName?: string | null;
  pokemonImage?: string | null;
  typeId?: number | null;
}

// ─── Mini dice row: read-only faces display ───────────────────────────────────
function CollectionDiceRow({
  diceFaces,
  faceTypesList,
}: {
  diceFaces: number[];
  faceTypesList: any[];
}) {
  const getFaceInfo = (faceTypeId: number | null) => {
    const faceType = faceTypesList?.find((ft) => ft.faceTypesId === faceTypeId);
    if (!faceType || !faceType.types || faceType.types.length === 0) {
      return { name1: "Normal", imageUrl1: "/img/Type/11.png", mixed: false };
    }
    if (faceType.types.length === 1) {
      return {
        name1: faceType.types[0].enName || "Normal",
        imageUrl1:
          faceType.types[0].typeImage ||
          `/img/Type/${faceType.types[0].id}.png`,
        mixed: false,
      };
    }
    return {
      name1: faceType.types[0].enName || "Normal",
      imageUrl1:
        faceType.types[0].typeImage || `/img/Type/${faceType.types[0].id}.png`,
      name2: faceType.types[1].enName || "Normal",
      imageUrl2:
        faceType.types[1].typeImage || `/img/Type/${faceType.types[1].id}.png`,
      mixed: true,
    };
  };

  return (
    <div className="grid grid-cols-6 gap-2 flex-1">
      {diceFaces.map((faceTypeId, idx) => {
        if (!faceTypeId || faceTypeId === 0) {
          return (
            <div
              key={idx}
              className="aspect-square rounded-md bg-[#3a3a3a] border border-dashed border-white/10"
            />
          );
        }
        const info = getFaceInfo(faceTypeId);
        return (
          <Face
            key={idx}
            imageUrl1={info.imageUrl1}
            name1={info.name1}
            imageUrl2={(info as any).imageUrl2}
            name2={(info as any).name2}
            mixed={info.mixed}
            className="w-8 aspect-square shadow-sm"
          />
        );
      })}
    </div>
  );
}

// ─── Slot Card ────────────────────────────────────────────────────────────────
function SlotCard({
  slot,
  pokemon,
  faceTypesList,
  deleteMode,
  onDeleteClick,
  onClick,
}: {
  slot: SlotData;
  pokemon?: PokemonInfo;
  faceTypesList: any[];
  deleteMode: boolean;
  onDeleteClick: (slotNumber: number) => void;
  onClick: () => void;
}) {
  const isEmpty =
    !pokemon ||
    (slot.dice1.every((v) => !v) &&
      slot.dice2.every((v) => !v) &&
      slot.dice3.every((v) => !v));

  const formattedDate = slot.updatedAt
    ? new Date(slot.updatedAt).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : null;

  return (
    <div 
      onClick={onClick}
      className={`bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20 ${!deleteMode ? 'cursor-pointer hover:bg-neutral-800/80 active:scale-[0.99]' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
        <span className="text-white font-bold text-sm tracking-wide">
          SetName : {slot.slotName || "Untitled"}{" "}
          <span className="text-white/50">(Slot{slot.slotNumber})</span>
        </span>
        {deleteMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(slot.slotNumber);
            }}
            className="ml-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-black px-3 py-1 rounded-lg transition-all shadow-md"
          >
            🗑 Delete
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Pokemon image */}
        <div className="relative w-30 h-30 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
          {isEmpty ? (
            <div className="flex items-center justify-center w-full h-full text-white/20">
              <svg
                width={36}
                height={36}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <Image
              src={pokemon?.pokemonImage || "/img/Unknown_Pokemon.png"}
              alt={pokemon?.enPokemonName || "Pokemon"}
              fill
              className="object-contain p-1"
            />
          )}
        </div>

        {/* Dice rows */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Dice icon + faces row */}
          {(["dice1", "dice2", "dice3"] as const).map((diceKey) => {
            const faces = slot[diceKey] as number[];
            return (
              <div key={diceKey} className="flex items-center w-fit gap-2">
                {/* Dice icon */}
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src="/Dice.png"
                    alt="dice"
                    fill
                    className="object-contain"
                  />
                </div>
                <CollectionDiceRow
                  diceFaces={faces}
                  faceTypesList={faceTypesList}
                />
              </div>
            );
          })}
        </div>

        {/* Date badge */}
        <div className="shrink-0 self-center">
          {formattedDate ? (
            <div className="bg-[#2e2e2e] border border-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">
                Latest Update
              </p>
              <p className="text-white text-xs font-bold mt-0.5">
                {formattedDate}
              </p>
            </div>
          ) : (
            <div className="bg-[#2e2e2e] border border-dashed border-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white/20 text-[10px]">No date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  slotNumber,
  slotName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  slotNumber: number;
  slotName?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e1e1e] rounded-[28px] max-w-sm w-full border border-red-500/30 p-8 shadow-2xl flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-white text-xl font-black mb-2">Delete Slot?</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-bold">
              {slotName || `Slot ${slotNumber}`}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-[#2e2e2e] hover:bg-[#3a3a3a] text-white font-bold py-3 rounded-xl border border-white/10 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [pokemonMap, setPokemonMap] = useState<Record<number, PokemonInfo>>({});
  const [faceTypesList, setFaceTypesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState<number | null>(null); // null = ALL

  const [deleteMode, setDeleteMode] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    slotNumber: number;
    slotName?: string | null;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSlotClick = (slot: SlotData) => {
    if (deleteMode) return;

    setLocalStorageItem(STORAGE_KEYS.POKEMON_ID, slot.pokemonId);
    setLocalStorageItem(STORAGE_KEYS.DICE_DATA, {
      dice1: slot.dice1,
      dice2: slot.dice2,
      dice3: slot.dice3,
    });
    setLocalStorageItem(STORAGE_KEYS.CURRENT_SKILL, slot.skills || []);
    setLocalStorageItem(STORAGE_KEYS.SLOT_NAME, slot.slotName || "Plakoro Slot");

    router.push("/");
  };

  // ── fetch data ──────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [slotsRes, pokemonRes, faceTypesRes] = await Promise.all([
        getApiSlots(),
        getApiPokemonList(),
        getApiFaceTypes(),
      ]);

      const rawSlots = slotsRes.data?.data || [];
      setSlots(rawSlots as SlotData[]);

      const pokemonList = pokemonRes.data?.data || [];
      const map: Record<number, PokemonInfo> = {};
      for (const p of pokemonList as PokemonInfo[]) {
        map[p.id] = p;
      }
      setPokemonMap(map);

      if (faceTypesRes.data?.success) {
        setFaceTypesList(faceTypesRes.data.data);
      }
    } catch (err) {
      console.error("Collection fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── filter by pokemon type ──────────────────────────────────────────────────
  const filteredSlots =
    selectedType === null
      ? slots
      : slots.filter((s) => pokemonMap[s.pokemonId]?.typeId === selectedType);

  // ── delete flow ─────────────────────────────────────────────────────────────
  const handleDeleteClick = (slotNumber: number) => {
    const slot = slots.find((s) => s.slotNumber === slotNumber);
    setPendingDelete({ slotNumber, slotName: slot?.slotName });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteApiSlotsBySlotNumber({
        path: { slotNumber: String(pendingDelete.slotNumber) },
        body: {},
      });
      setPendingDelete(null);
      setDeleteMode(false);
      await fetchAll();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-8 bg-gray-200 flex justify-center">
      <div className="z-2 bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shrink-0">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3V6.4C7 6.96 7 7.24 7.109 7.454C7.205 7.642 7.358 7.795 7.546 7.891C7.76 8 8.04 8 8.6 8H15.4C15.96 8 16.24 8 16.454 7.891C16.642 7.795 16.795 7.642 16.891 7.454C17 7.24 17 6.96 17 6.4V4M17 21V14.6C17 14.04 17 13.76 16.891 13.546C16.795 13.358 16.642 13.205 16.454 13.109C16.24 13 15.96 13 15.4 13H8.6C8.04 13 7.76 13 7.546 13.109C7.358 13.205 7.205 13.358 7.109 13.546C7 13.76 7 14.04 7 14.6V21M21 9.325V16.2C21 17.88 21 18.72 20.673 19.362C20.385 19.927 19.927 20.385 19.362 20.673C18.72 21 17.88 21 16.2 21H7.8C6.12 21 5.28 21 4.638 20.673C4.074 20.385 3.615 19.927 3.327 19.362C3 18.72 3 17.88 3 16.2V7.8C3 6.12 3 5.28 3.327 4.638C3.615 4.074 4.074 3.615 4.638 3.327C5.28 3 6.12 3 7.8 3H14.675C15.164 3 15.408 3 15.639 3.055C15.843 3.104 16.038 3.185 16.217 3.295C16.418 3.418 16.591 3.591 16.937 3.937L20.063 7.063C20.409 7.409 20.582 7.582 20.705 7.783C20.815 7.962 20.896 8.157 20.945 8.362C21 8.592 21 8.836 21 9.325Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1a1a1a] leading-tight font-salsa">
              Collection
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-0.5">
              Saved Items
            </p>
          </div>
        </div>

        {/* ── Type Filter Pills ── */}
        <div className="flex flex-wrap gap-2">
          {/* ALL pill */}
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide italic transition-all ${
              selectedType === null
                ? "bg-[#1a1a1a] text-white ring-2 ring-black scale-105 shadow-md"
                : "bg-[#1a1a1a] text-white opacity-70 hover:opacity-100"
            }`}
          >
            ALL
          </button>

          {TYPE_FILTER_ORDER.map((typeId) => {
            const style = TYPE_STYLES[typeId];
            if (!style) return null;
            const isSelected = selectedType === typeId;
            return (
              <button
                key={typeId}
                onClick={() =>
                  setSelectedType(selectedType === typeId ? null : typeId)
                }
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide italic transition-all ${
                  isSelected
                    ? "ring-2 ring-white scale-105 shadow-md"
                    : "opacity-90 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                }}
              >
                {style.label}
              </button>
            );
          })}
        </div>

        {/* ── Slot List ── */}
        <div className="flex flex-col gap-4">
          {loading ? (
            // Skeleton
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg
                className="mx-auto mb-4 opacity-30"
                width={48}
                height={48}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p className="font-medium text-sm">
                {selectedType !== null
                  ? `No saved slots for ${TYPE_STYLES[selectedType]?.label ?? ""} type`
                  : "No saved slots yet"}
              </p>
            </div>
          ) : (
            filteredSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                pokemon={pokemonMap[slot.pokemonId]}
                faceTypesList={faceTypesList}
                deleteMode={deleteMode}
                onDeleteClick={handleDeleteClick}
                onClick={() => handleSlotClick(slot)}
              />
            ))
          )}
        </div>

        {/* ── Delete Mode Toggle ── */}
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <button
            onClick={() => setDeleteMode((d) => !d)}
            className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-md ${
              deleteMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-[#1a1a1a] text-white hover:bg-neutral-800"
            }`}
          >
            {deleteMode ? "✓ Done" : "Delete"}
          </button>
        </div>
      </div>

      {/* ── Confirm Delete Modal ── */}
      {pendingDelete && (
        <ConfirmDeleteModal
          slotNumber={pendingDelete.slotNumber}
          slotName={pendingDelete.slotName}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
