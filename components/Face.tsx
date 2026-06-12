import { typecolor } from "@/constants/TypeColor";

interface FaceProps {
  imageUrl1: string;
  imageUrl2?: string;
  name1: string;
  name2?: string;
  mixed?: boolean;
  className?: string;
}

export default function Face({
  imageUrl1,
  imageUrl2,
  name1,
  name2,
  mixed,
  className,
}: FaceProps) {
  const bgColor1 = typecolor[name1 as keyof typeof typecolor] || "#bbadad";
  const bgColor2 = name2
    ? typecolor[name2 as keyof typeof typecolor] || "#bbadad"
    : bgColor1;

  return (
    <div
      className={`${className} aspect-square rounded-md overflow-hidden flex justify-center items-center border border-white p-1`}
      style={{
        background: mixed
          ? `linear-gradient(135deg, ${bgColor1} 50%, ${bgColor2} 50%)`
          : bgColor1,
      }}
    >
      {mixed ? (
        <div className="relative w-full h-full">
          <div className="absolute top-1/2 left-1/2 w-[142%] h-[2px] bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none" />
          <img
            src={imageUrl1}
            alt={name1}
            className="absolute top-1 left-1 w-[45%] h-[45%] object-contain"
          />
          {imageUrl2 && (
            <img
              src={imageUrl2}
              alt={name2 || ""}
              className="absolute bottom-1 right-1 w-[45%] h-[45%] object-contain"
            />
          )}
        </div>
      ) : (
        <img
          src={imageUrl1}
          alt={name1}
          className="w-2/3 h-2/3 object-contain"
        />
      )}
    </div>
  );
}
