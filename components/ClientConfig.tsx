"use client";

import { client } from "@/src/api/generated/client.gen";

client.setConfig({
  baseUrl: process.env.BACKEND_URL || "http://localhost:3000",
  credentials: "include",
});

export default function ClientConfig() {
  return null;
}
