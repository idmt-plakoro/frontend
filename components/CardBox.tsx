import { directions } from "@/constants/directions";
import Face from "./Face";
import { useTranslation } from "react-i18next";

export interface SkillCard {
  id: number;
  name: {
    en?: string | null | undefined;
    th?: string | null | undefined;
  };
  imageUrl?: string | null | undefined;
  typeId?: number | null | undefined;
  damage?: number | null | undefined;
  fightingAbility?:
    | {
        en?: string | null | undefined;
        th?: string | null | undefined;
      }
    | undefined;
  energyCosts: {
    typeId?: number | null | undefined;
    quantity?: number | null | undefined;
  }[];
  effects: {
    ability: {
      en?: string | null | undefined;
      th?: string | null | undefined;
    };
    directions?: string[] | null | undefined;
  }[];
}

interface CardBoxProps {
  func?: React.MouseEventHandler<HTMLButtonElement>;
  card?: SkillCard | null;
  disabled?: boolean;
  className?: string;
  type?: Array<{
    id: number;
    enName?: string | null;
    thName?: string | null;
    typeImage?: string | null;
  }>;
  chance?: number;
}

export default function CardBox({
  func,
  card,
  disabled = false,
  className,
  type,
  chance,
}: CardBoxProps) {
  const {t,i18n} = useTranslation();
  const recommended = chance! >= 50 || false;
  return (
    <div
      className={`font-salsa relative w-full p-4 h-40 bg-white drop-shadow-md/20 rounded-md flex flex-row justify-between items-center gap-2 ${recommended ? "ring-5 ring-yellow-300" : ""} ${className}`}
    >
      {recommended && (
        <div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-300 rounded-full drop-shadow-lg/20 flex items-center justify-center">
          <img src="/thumb-up.svg" className="w-7 h-7 -rotate-15" />
        </div>
      )}
      <div className="flex flex-col">
        {card?.imageUrl && (
          <img
            src={card.imageUrl}
            alt={card.name?.en || card.name?.th || "Skill Card"}
            className="w-40 object-contain rounded-md "
          />
        )}
        <p className="text-center">
          {i18n.language === "th" && card?.name?.th ? card.name.th : card?.name?.en}
        </p>
      </div>
      <div className="flex flex-row gap-2 min-w-50">
        {card?.energyCosts.flatMap((cost, costIndex) => {
          const quantity = cost.quantity ?? 0;
          const faces = [];
          const typeInfo = Array.isArray(type)
            ? type.find((t) => t.id === cost.typeId)
            : undefined;

          for (let i = 0; i < quantity; i++) {
            if (typeInfo) {
              faces.push(
                <div key={`${costIndex}-${i}`}>
                  <Face
                    imageUrl1={typeInfo.typeImage ?? ""}
                    name1={typeInfo.enName ?? ""}
                    className="w-10 h-10"
                  />
                </div>,
              );
            } else {
              faces.push(
                <div key={`${costIndex}-${i}`}>
                  <Face
                    imageUrl1={cost.typeId + ""}
                    name1={cost.typeId + ""}
                    className="w-8 h-8"
                  />
                </div>,
              );
            }
          }
          return faces;
        })}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        {card?.effects.flatMap((effect, effectIndex) => {
          const effects = [];

          effects.push(
            <div
              key={effectIndex}
              className="flex flex-row flex-1 min-w-0 items-center gap-1"
            >
              <div className="flex flew-row gap-0.5 min-w-23">
                {effect.directions?.map((direction, directionIndex) => (
                  <img
                    key={directionIndex}
                    src={directions[direction as keyof typeof directions]}
                    className="w-7 h-7"
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0 py-1 px-3 m-1 bg-[#9a9999] rounded-full">
                <div className="w-full text-nowrap overflow-x-auto no-scrollbar mask-fade flex flex-row">
                  <span className="text-white">
                    {i18n.language === "th" && effect.ability.th ? effect.ability.th : effect.ability.en}
                  </span>
                  <div className="w-6 shrink-0" />
                </div>
              </div>
            </div>,
          );
          return effects;
        })}
      </div>

      <div className="w-1 h-[85%] bg-[#999999]"></div>

      <div className="flex flex-col h-[85%] justify-center items-center rounded-xl aspect-square bg-[#757575]">
        <span className="text-xl text-white">{t("card.chance")}</span>
        <span className="text-2xl text-white">{chance}%</span>
      </div>
    </div>
  );
}
