"use client";
import { useEffect, useState } from "react";
import { GetAuthAccountResponse, putAuthAccount } from "@/src/api/generated";
import Modal from "./Modal";
import Button from "../Button";

const AVATARS = [
  { name: "Pikachu", file: "Pikachu.png", bgColor: "#FFF5C3" },
  { name: "Bulbasaur", file: "Bulbasaur.png", bgColor: "#A3F2D4" },
  { name: "Charmander", file: "Charmander.png", bgColor: "#FFC6C6" },
  { name: "Squirtle", file: "Squirtle.png", bgColor: "#C6EBFF" },
  { name: "Evee", file: "Evee.png", bgColor: "#F5E1C3" },
  { name: "Mew", file: "Mew.png", bgColor: "#FFD9F3" },
];

export default function EditProfileModal({
  user,
  onClose,
}: {
  user: GetAuthAccountResponse["data"] | null;
  onClose?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize values when user data is available
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      if (user.avatarUrl) {
        const foundIndex = AVATARS.findIndex((av) =>
          user.avatarUrl?.includes(av.file),
        );
        if (foundIndex !== -1) {
          setCurrentIndex(foundIndex);
        }
      }
    }
  }, [user]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + AVATARS.length) % AVATARS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % AVATARS.length);
  };

  const handleConfirm = async () => {
    if (!displayName.trim()) {
      alert("Name cannot be empty!");
      return;
    }
    setIsSaving(true);
    try {
      const avatarUrl = `https://plakoro.com/avatars/${AVATARS[currentIndex].file}`;
      const res = await putAuthAccount({
        body: {
          displayName: displayName.trim(),
          avatarUrl,
        },
      });
      if (res.data?.success) {
        // Reload page to update layout/navbar with fresh profile data
        window.location.reload();
      } else {
        alert(
          "Failed to save profile: " +
            ((res.data as any)?.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const prevIndex = (currentIndex - 1 + AVATARS.length) % AVATARS.length;
  const nextIndex = (currentIndex + 1) % AVATARS.length;

  return (
    <Modal isOpen={true} onClose={() => {}} noBackground={true}>
      <div className="flex flex-col items-center select-none font-salsa w-full py-2">
        {/* Title Section */}
        <h2 className="text-3xl font-normal self-start ml-4 tracking-wide text-white mt-1">
          Profile
        </h2>
        <p className="text-md text-gray-300 self-start ml-4 opacity-80 mt-1">
          Choose avatar and name
        </p>

        {/* Divider */}
        <div className="w-[95%] h-[1px] bg-white/20 my-4" />

        {/* Choose Avatar Header */}
        <p className="text-lg italic text-gray-300 mb-6 mt-2">
          Choose your avatar
        </p>

        {/* Avatar Carousel Row */}
        <div className="flex items-center justify-between w-full max-w-sm px-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="text-gray-400 hover:text-white transition duration-200 cursor-pointer p-1"
          >
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="15,18 9,12 15,6" />
            </svg>
          </button>

          {/* Left Avatar (Previous) */}
          <div
            onClick={handlePrev}
            className="w-14 h-14 rounded-full overflow-hidden border border-white/10 flex items-center justify-center opacity-40 cursor-pointer hover:opacity-60 transition duration-200"
            style={{ backgroundColor: AVATARS[prevIndex].bgColor + "40" }}
          >
            <img
              src={`/avatars/${AVATARS[prevIndex].file}`}
              alt={AVATARS[prevIndex].name}
              className="w-[80%] h-[80%] object-contain"
            />
          </div>

          {/* Center Avatar (Selected) */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-[4px] border-[#2c3e50] shadow-lg flex items-center justify-center transform scale-110 transition duration-300"
            style={{ backgroundColor: AVATARS[currentIndex].bgColor }}
          >
            <img
              src={`/avatars/${AVATARS[currentIndex].file}`}
              alt={AVATARS[currentIndex].name}
              className="w-[82%] h-[82%] object-contain"
            />
          </div>

          {/* Right Avatar (Next) */}
          <div
            onClick={handleNext}
            className="w-14 h-14 rounded-full overflow-hidden border border-white/10 flex items-center justify-center opacity-40 cursor-pointer hover:opacity-60 transition duration-200"
            style={{ backgroundColor: AVATARS[nextIndex].bgColor + "40" }}
          >
            <img
              src={`/avatars/${AVATARS[nextIndex].file}`}
              alt={AVATARS[nextIndex].name}
              className="w-[80%] h-[80%] object-contain"
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-white transition duration-200 cursor-pointer p-1"
          >
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="9,6 15,12 9,18" />
            </svg>
          </button>
        </div>

        {/* Name Input Section */}
        <div className="flex items-center gap-4 mt-10 mb-8">
          <span className="text-xl font-normal text-white/70">Name :</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-white text-black text-lg font-medium py-2 px-6 rounded-full w-60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        {/* Action Button Section */}
        <div className="flex justify-end w-full px-4 mt-4">
          <Button
            text={isSaving ? "Saving..." : "Confirm"}
            func={handleConfirm}
            disabled={isSaving}
            className="bg-[#fdd835] hover:bg-[#fbc02d] text-black font-bold text-lg rounded-xl shadow-md py-1.5 px-6"
          />
        </div>
      </div>
    </Modal>
  );
}
