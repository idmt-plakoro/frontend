"use client";
import { cache } from "react";
import { getAuthAccount } from "@/src/api/generated";

export const getAuthAccountCached = cache(() => getAuthAccount());
