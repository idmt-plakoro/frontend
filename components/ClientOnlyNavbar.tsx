"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function ClientOnlyNavbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <nav className="h-12.5 bg-[#111111]" />; // ใส่โครงเปล่าๆ ไว้ก่อนเพื่อกัน Layout Shift
  return <Navbar />;
}