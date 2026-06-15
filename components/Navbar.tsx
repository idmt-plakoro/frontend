"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between h-[50px] z-30 px-6 py-4 bg-[#111111] text-white font-salsa">
      {/* LEFT LOGO */}
      <div
        className="text-2xl font-bold tracking-wider cursor-pointer"
        onClick={() => router.push("/")}
      >
        Plakoro
      </div>

      {/* RIGHT MENU */}
      <div className="flex items-center space-x-6 text-sm font-medium">
        {/* ตรงนี้เตรียมไว้ใส่ฟังก์ชันแปลภาษา เช่น t('help') */}
        <Link
          href="/"
          className="group flex items-center gap-2 hover:text-yellow-400"
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white group-hover:stroke-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              strokeWidth="2.4"
            ></path>{" "}
            <path
              d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
            <path
              d="M12 16H12.01"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </svg>
          Help
        </Link>
        <Link href="/" className="hover:text-yellow-400">
          Home
        </Link>

        {/* ปุ่มเปลี่ยนภาษา */}
        <button className="group flex items-center gap-1 hover:text-yellow-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width={20}
            height={20}
            className="stroke-white group-hover:stroke-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M12 21C9.4651 18.3899 8 15.3051 8 12C8 8.69488 9.4651 5.61005 12 3M12 21C14.5349 18.3899 16 15.3051 16 12C16 8.69488 14.5349 5.61005 12 3M20 9H4M20 15H4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          EN
        </button>

        <Link
          href="/collection"
          className="group flex items-center gap-2 hover:text-yellow-400"
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white group-hover:stroke-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 3V6.4C7 6.96005 7 7.24008 7.10899 7.45399C7.20487 7.64215 7.35785 7.79513 7.54601 7.89101C7.75992 8 8.03995 8 8.6 8H15.4C15.9601 8 16.2401 8 16.454 7.89101C16.6422 7.79513 16.7951 7.64215 16.891 7.45399C17 7.24008 17 6.96005 17 6.4V4M17 21V14.6C17 14.0399 17 13.7599 16.891 13.546C16.7951 13.3578 16.6422 13.2049 16.454 13.109C16.2401 13 15.9601 13 15.4 13H8.6C8.03995 13 7.75992 13 7.54601 13.109C7.35785 13.2049 7.20487 13.3578 7.10899 13.546C7 13.7599 7 14.0399 7 14.6V21M21 9.32548V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H14.6745C15.1637 3 15.4083 3 15.6385 3.05526C15.8425 3.10425 16.0376 3.18506 16.2166 3.29472C16.4184 3.4184 16.5914 3.59135 16.9373 3.93726L20.0627 7.06274C20.4086 7.40865 20.5816 7.5816 20.7053 7.78343C20.8149 7.96237 20.8957 8.15746 20.9447 8.36154C21 8.59171 21 8.8363 21 9.32548Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          Collection
        </Link>
        <Link
          href="/login"
          className="group flex items-center gap-2 hover:text-yellow-400"
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white group-hover:stroke-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </svg>
          Sign-up/Sign-in
        </Link>
      </div>
    </nav>
  );
}
