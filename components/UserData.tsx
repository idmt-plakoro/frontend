"use client";
import { useEffect, useState } from "react";
import { getAuthAccount, GetAuthAccountResponse } from "@/src/api/generated";
import ProfileModal from "./Modals/ProfileModal";
import EditProfileModal from "./Modals/EditProfileModal";

export default function UserData() {
  const [user, setUser] = useState<GetAuthAccountResponse["data"] | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    try {
      getAuthAccount().then((res) => {
        if (res.data?.success) {
          setUser(res.data.data);
          if (!res.data.data?.avatarUrl || res.data.data.avatarUrl === "") {
            setOpenEdit(true);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      {openEdit ? (
        <EditProfileModal user={user} onClose={() => setOpenEdit(false)} />
      ) : (
        <ProfileModal
          user={user}
          setUser={setUser}
          onEdit={() => setOpenEdit(true)}
        />
      )}
    </div>
  );
}
