import { validateDiceConfig } from "./calculate";

export interface ShareData {
  pokemonId: number;
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  };
  savedSkillIds: number[];
  firstTurn: boolean;
  banDice: {
    row: string;
    index: number;
  };
}

/**
 * Checks if the current configuration is valid to be shared.
 */
export function canShare(diceData: any): { canShare: boolean; reason?: string } {
  if (!validateDiceConfig(diceData)) {
    return {
      canShare: false,
      reason: "Please make sure all 3 dice have 6 faces configured before sharing.",
    };
  }
  return { canShare: true };
}

/**
 * Encodes configuration into a Base64-encoded string.
 */
export function encodeConfig(data: ShareData): string {
  const jsonStr = JSON.stringify(data);
  // UTF-8 safe Base64 encoding
  const base64 = btoa(
    encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match: string, p1: string) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  // Convert standard Base64 to URL-safe Base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes configuration from a Base64-encoded string.
 */
export function decodeConfig(base64: string): ShareData | null {
  try {
    // Convert URL-safe Base64 back to standard Base64
    let str = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: any) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonStr) as ShareData;
  } catch (error) {
    console.error("Failed to decode share configuration:", error);
    return null;
  }
}

/**
 * Validates the structure and constraints of decoded share configuration.
 */
export function validateShareData(data: any): data is ShareData {
  if (!data) return false;
  
  // Validate pokemonId
  if (typeof data.pokemonId !== "number" || data.pokemonId <= 0) return false;
  
  // Validate diceData
  if (!data.diceData) return false;
  const { dice1, dice2, dice3 } = data.diceData;
  if (!Array.isArray(dice1) || dice1.length !== 6) return false;
  if (!Array.isArray(dice2) || dice2.length !== 6) return false;
  if (!Array.isArray(dice3) || dice3.length !== 6) return false;
  
  // Validate each face in dice data (must be a number or null)
  const allFaces = [...dice1, ...dice2, ...dice3];
  if (!allFaces.every(face => face === null || typeof face === "number")) return false;

  return true;
}
