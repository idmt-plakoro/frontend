"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface LoginModalProps {
  isOpen: boolean;
}

export default function LoginModal({ isOpen }: LoginModalProps) {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={() => router.push("/")} noBackground={true}>
      <p className="pl-4 self-center text-left text-2xl">Account</p>
      <p className="pl-4 self-center text-left text-md opacity-60">
        Sign-in / Login
      </p>
      <div className="flex items-center justify-center text-center m-2">
        <div className="bg-white opacity-60 w-[95%] h-px" />
      </div>
      <div className="flex flex-col items-center justify-center m-8 gap-3">
        <button className="flex flex-row items-center self-center justify-center bg-white rounded-full w-4/5 h-10 text-black cursor-pointer">
          <img
            className="w-6 h-6 m-2 rounded-l-full"
            src="/google-color.svg"
            alt=""
          />{" "}
          Google
        </button>
        <button className="flex flex-row items-center self-center justify-center bg-white rounded-full w-4/5 h-10 text-black cursor-pointer">
          <img
            className="w-6 h-6 m-2 rounded-full"
            src="/line-logo.svg"
            alt=""
          />{" "}
          line
        </button>
      </div>
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <p
          className="text-white opacity-60 underline cursor-pointer"
          onClick={() => router.push("/")}
        >
          Continue as guest
        </p>
      </div>
    </Modal>
  );
}
