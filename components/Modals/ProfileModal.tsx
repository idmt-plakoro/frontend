"use client";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import {
  getAuthAccount,
  getAuthLogout,
  type GetAuthAccountResponse,
} from "@/src/api/generated";
import Button from "../Button";
import { getAvatarUrl } from "@/libs/avatar";
import { useRouter } from "next/navigation";

export default function ProfileModal({
  user,
  setUser,
  onEdit,
}: {
  user: GetAuthAccountResponse["data"] | null;
  setUser: (user: GetAuthAccountResponse["data"] | null) => void;
  onEdit?: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setUser(null);
      await getAuthLogout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  return (
    <Modal isOpen={true} onClose={() => {}} noBackground={true}>
      <p className="mt-4 self-center text-center text-2xl">Profile</p>
      <p className="self-center text-center text-md opacity-70">User Profile</p>
      <div className="flex items-center justify-center text-center m-2">
        <div className="bg-white opacity-70 w-[95%] h-px" />
      </div>
      <div className="flex flex-col items-center justify-center text-center m-2 mt-8 gap-4">
        <p className="self-center text-center text-md opacity-70 underline">
          Avatar
        </p>
        <img
          src={getAvatarUrl(user?.avatarUrl)}
          alt="Avatar"
          className="w-25 h-25 rounded-full object-cover border border-white/20"
        />
        <div className="flex flex-col gap-1">
          <p className="self-center text-center text-md opacity-70">
            Name: {user?.displayName}
          </p>
          <p className="self-center text-center text-md opacity-70">
            Email: {user?.email}
          </p>
          <p
            className="self-center text-center text-md opacity-70"
            suppressHydrationWarning
          >
            Created At:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleString("en", {
                  timeZone: "UTC",
                })
              : "—"}
          </p>
          <p
            className="self-center text-center text-md opacity-70"
            suppressHydrationWarning
          >
            Last Modified:{" "}
            {user?.updatedAt
              ? new Date(user.updatedAt).toLocaleString("en", {
                  timeZone: "UTC",
                })
              : "—"}
          </p>
        </div>
      </div>

      <div className="h-20" />
      <div className="flex justify-end items-center text-black font-bold gap-3 text-nowrap">
        <Button
          text="Edit"
          func={onEdit || (() => {})}
          className="bg-yellow-200"
        />
        <Button text="Log-out" func={handleLogout} className="bg-yellow-300" />
      </div>
    </Modal>
  );
}
