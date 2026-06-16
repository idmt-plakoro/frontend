"use client";

interface ButtonProps {
  text: string;
  func?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export default function Button({
  text,
  func,
  disabled = false,
  className = "",
  width = "w-27 px-6",
  height = "h-10 py-2",
}: ButtonProps) {
  return (
    <button
      className={`text-lg text-center ${width} ${height} rounded-lg transition cursor-pointer drop-shadow-md/25 ${disabled ? "bg-gray-400 hover:bg-gray-400" : ""} ${className || ""}`}
      onClick={func}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
