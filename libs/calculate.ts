export interface ComboResult {
  comboKey: string;
  combos: number;
  probability: string;
  cumulative: string;
}

/**
 * Validates whether all 3 dice have 6 configured faces (i.e. no slot is null, undefined, or 0).
 */
export function validateDiceConfig(diceData: {
  dice1: (number | null)[];
  dice2: (number | null)[];
  dice3: (number | null)[];
}): boolean {
  const allFaces = [
    ...diceData.dice1,
    ...diceData.dice2,
    ...diceData.dice3,
  ];
  return allFaces.every((face) => face !== null && face !== undefined && face !== 0);
}

/**
 * Helper to get the type names of a single face by its ID using faceTypesList.
 */
export function getFaceTypes(faceTypeId: number | null, faceTypesList: any[]): string[] {
  if (faceTypeId === null || faceTypeId === undefined || faceTypeId === 0) return [];
  const faceType = faceTypesList?.find((ft) => ft.faceTypesId === faceTypeId);
  if (!faceType || !faceType.types || faceType.types.length === 0) {
    return ["Normal"];
  }
  return faceType.types.map((t: any) => t.enName || "Normal");
}

/**
 * Calculates combinations, probability, and cumulative percentage of types rolled.
 * Rolls 3 dice by default, or 2 dice if firstTurn is active (excluding the row banDiceRow).
 */
export function calculateDiceProbability(
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  },
  firstTurn: boolean,
  banDiceRow: string,
  faceTypesList: any[]
): ComboResult[] {
  const diceToRoll: (number | null)[][] = [];
  if (firstTurn) {
    if (banDiceRow !== "dice1") diceToRoll.push(diceData.dice1);
    if (banDiceRow !== "dice2") diceToRoll.push(diceData.dice2);
    if (banDiceRow !== "dice3") diceToRoll.push(diceData.dice3);
  } else {
    diceToRoll.push(diceData.dice1);
    diceToRoll.push(diceData.dice2);
    diceToRoll.push(diceData.dice3);
  }

  const numDice = diceToRoll.length;
  if (numDice === 0) return [];

  const totalRolls = Math.pow(6, numDice);
  const comboCounts: Record<string, number> = {};

  // Generate all 6^numDice outcome combinations
  const outcomes: number[][] = [];
  if (numDice === 2) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        outcomes.push([i, j]);
      }
    }
  } else if (numDice === 3) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < 6; k++) {
          outcomes.push([i, j, k]);
        }
      }
    }
  }

  // Aggregate face type counts for each outcome
  for (const outcome of outcomes) {
    const typeCounts: Record<string, number> = {};
    for (let d = 0; d < numDice; d++) {
      const faceIdx = outcome[d];
      const faceTypeId = diceToRoll[d][faceIdx];
      const types = getFaceTypes(faceTypeId, faceTypesList);
      for (const t of types) {
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      }
    }

    // Build sorted key representation, e.g. "Darkness x1 | Grass x1"
    const sortedTypes = Object.keys(typeCounts).sort();
    let comboKey = sortedTypes
      .map((t) => `${t} x${typeCounts[t]}`)
      .join(" | ");
    if (!comboKey) {
      comboKey = "None";
    }

    comboCounts[comboKey] = (comboCounts[comboKey] || 0) + 1;
  }

  // Convert map to results array with raw values for sorting
  const resultsWithRaw = Object.keys(comboCounts).map((key) => {
    const combos = comboCounts[key];
    const probabilityVal = (combos / totalRolls) * 100;
    return {
      comboKey: key,
      combos,
      probabilityVal,
    };
  });

  // Sort by combos descending
  resultsWithRaw.sort((a, b) => b.combos - a.combos);

  // Calculate cumulative percentages
  let runningSum = 0;
  return resultsWithRaw.map((res) => {
    runningSum += res.probabilityVal;
    return {
      comboKey: res.comboKey,
      combos: res.combos,
      probability: res.probabilityVal.toFixed(2) + "%",
      cumulative: Math.min(100, runningSum).toFixed(2) + "%",
    };
  });
}

function checkSatisfaction(
  rolledFaces: number[][],
  requiredCosts: any[],
  normalTypeId: number
): boolean {
  const rolledCounts: Record<number, number> = {};
  for (const face of rolledFaces) {
    for (const typeId of face) {
      rolledCounts[typeId] = (rolledCounts[typeId] || 0) + 1;
    }
  }

  let normalRequiredQty = 0;
  for (const cost of requiredCosts) {
    const typeId = cost.typeId;
    const qty = cost.quantity || 0;
    if (typeId === normalTypeId) {
      normalRequiredQty += qty;
    } else {
      const rolledQty = rolledCounts[typeId] || 0;
      if (rolledQty < qty) {
        return false;
      }
      rolledCounts[typeId] = rolledQty - qty;
    }
  }

  let totalLeftover = 0;
  for (const typeId in rolledCounts) {
    totalLeftover += rolledCounts[typeId];
  }

  return totalLeftover >= normalRequiredQty;
}

/**
 * Calculates the probability (0-100) of satisfying a card's energy costs
 * with the current dice configuration.
 */
export function calculateCardProbability(
  card: any,
  diceData: {
    dice1: (number | null)[];
    dice2: (number | null)[];
    dice3: (number | null)[];
  },
  firstTurn: boolean,
  banDiceRow: string,
  faceTypesList: any[],
  normalTypeId: number = 11
): number {
  if (!validateDiceConfig(diceData)) {
    return 0;
  }

  const diceToRoll: (number | null)[][] = [];
  if (firstTurn) {
    if (banDiceRow !== "dice1") diceToRoll.push(diceData.dice1);
    if (banDiceRow !== "dice2") diceToRoll.push(diceData.dice2);
    if (banDiceRow !== "dice3") diceToRoll.push(diceData.dice3);
  } else {
    diceToRoll.push(diceData.dice1);
    diceToRoll.push(diceData.dice2);
    diceToRoll.push(diceData.dice3);
  }

  const numDice = diceToRoll.length;
  if (numDice === 0) return 0;

  const totalRolls = Math.pow(6, numDice);

  // Generate outcomes
  const outcomes: number[][] = [];
  if (numDice === 2) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        outcomes.push([i, j]);
      }
    }
  } else if (numDice === 3) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < 6; k++) {
          outcomes.push([i, j, k]);
        }
      }
    }
  }

  let satisfyingOutcomes = 0;

  for (const outcome of outcomes) {
    const rolledFaces: number[][] = [];
    for (let d = 0; d < numDice; d++) {
      const faceIdx = outcome[d];
      const faceTypeId = diceToRoll[d][faceIdx];
      const faceType = faceTypesList?.find((ft) => ft.faceTypesId === faceTypeId);
      if (faceType && faceType.types) {
        rolledFaces.push(faceType.types.map((t: any) => t.id));
      } else {
        rolledFaces.push([]);
      }
    }

    if (checkSatisfaction(rolledFaces, card.energyCosts || [], normalTypeId)) {
      satisfyingOutcomes++;
    }
  }

  const probability = (satisfyingOutcomes / totalRolls) * 100;
  return Math.round(probability * 100) / 100;
}

