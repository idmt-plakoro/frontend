"use client";
import { useEffect, useState } from "react";
import { GetAuthAccountResponse } from "@/src/api/generated";
import { getAuthAccountCached } from "@/libs/authCache";
import ProfileModal from "./Modals/ProfileModal";
import EditProfileModal from "./Modals/EditProfileModal";

export default function Profile() {
  const [user, setUser] = useState<GetAuthAccountResponse["data"] | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    try {
      getAuthAccountCached().then((res) => {
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
