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
import { useTranslation } from "react-i18next";

export default function ProfileModal({
  user,
  setUser,
  onEdit,
}: {
  user: GetAuthAccountResponse["data"] | null;
  setUser: (user: GetAuthAccountResponse["data"] | null) => void;
  onEdit?: () => void;
}) {
  const {t, i18n} = useTranslation();
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
      <p className="mt-4 self-center text-center text-2xl">{t("profile.title")}</p>
      <p className="self-center text-center text-md opacity-70">{t("profile.subtitle")}</p>
      <div className="flex items-center justify-center text-center m-2">
        <div className="bg-white opacity-70 w-[95%] h-px" />
      </div>
      <div className="flex flex-col items-center justify-center text-center m-2 mt-8 gap-4">
        <p className="self-center text-center text-md opacity-70 underline">
          {t("profile.avatar")}
        </p>
        <img
          src={getAvatarUrl(user?.avatarUrl)}
          alt="Avatar"
          className="w-25 h-25 rounded-full object-cover border border-white/20"
        />
        <div className="flex flex-col gap-1">
          <p className="self-center text-center text-md opacity-70">
            {t("profile.name")}: {user?.displayName}
          </p>
          <p className="self-center text-center text-md opacity-70">
            {t("profile.email")}: {user?.email}
          </p>
          <p
            className="self-center text-center text-md opacity-70"
            suppressHydrationWarning
          >
            {t("profile.createdAt")}:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleString(i18n.language || "en", {
                  timeZone: "UTC",
                })
              : "—"}
          </p>
          <p
            className="self-center text-center text-md opacity-70"
            suppressHydrationWarning
          >
            {t("profile.lastModified")}{" "}
            {user?.updatedAt
              ? new Date(user.updatedAt).toLocaleString(i18n.language || "en", {
                  timeZone: "UTC",
                })
              : "—"}
          </p>
        </div>
      </div>

      <div className="h-20" />
      <div className="flex justify-end items-center text-black font-bold gap-3 text-nowrap">
        <Button
          text={t("button.edit")}
          func={onEdit || (() => {})}
          className="bg-yellow-200 w-auto"
        />
        <Button text={t("button.logout")} func={handleLogout} className="bg-yellow-300 w-auto" />
      </div>
    </Modal>
  );
}
