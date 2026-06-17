"use client";

import { useTranslation } from "react-i18next";
import CardBox, { SkillCard } from "../CardBox";

interface ViewMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SkillCard[];
  cardChances: Record<number, number>;
  types?: Array<{
    id: number;
    enName?: string | null;
    thName?: string | null;
    typeImage?: string | null;
  }>;
  pokemonName?: {
    en: string;
    th: string;
  };
}

export default function ViewMoreModal({
  isOpen,
  onClose,
  cards = [],
  cardChances = {},
  types = [],
  pokemonName,
}: ViewMoreModalProps) {
  if (!isOpen) return null;

  const hasCalculated = Object.keys(cardChances).length > 0;

  const {t,i18n} = useTranslation();
  console.log('this',pokemonName)
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[70vw] flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-gray-100">
          <h2 className="text-3xl font-black font-salsa text-gray-900">
            {t("card.viewMoreModal.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-salsa">
            {hasCalculated
              ? `${t("card.viewMoreModal.hasCalculated")}`
              : `${t("card.viewMoreModal.noCalculated")}`}
            {pokemonName && (
              <span className="ml-1">
                · {i18n.language === "th" && pokemonName.th ? pokemonName.th : pokemonName.en}
              </span>
            )}
          </p>
        </div>

        {/* Cards List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-3">🃏</span>
              <p className="font-salsa text-lg">{t("card.viewMoreModal.noCards")}</p>
            </div>
          ) : (
            cards.map((card) => {
              const chance = hasCalculated ? (cardChances[card.id] ?? 0) : 0;
              return (
                <CardBox
                  key={card.id}
                  card={card}
                  type={types}
                  chance={chance}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-center">
          <button
            onClick={onClose}
            className="font-salsa font-bold bg-black text-white px-10 py-2 rounded-full hover:bg-neutral-800 transition active:scale-95 shadow-md tracking-wide"
          >
            {t("card.viewMoreModal.back")}
          </button>
        </div>
      </div>
    </div>
  );
}
