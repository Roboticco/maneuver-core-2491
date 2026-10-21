/**
 * 2026 REBUILT Game Data Transformation
 *
 * Converts button-tap action arrays to counter fields for storage.
 * Each action object has shape: { actionType: string, phase: string, timestamp: number }
 *
 * Counter fields produced:
 *   auto:    startPosition, fuelScoredCount, shotOnTheMoveCount, shotStationaryCount,
 *            depotCollectCount, outpostCollectCount, fuelPassedCount, foulCommittedCount,
 *            + all auto toggle defaults
 *   teleop:  fuelScoredCount, shotOnTheMoveCount, shotStationaryCount,
 *            depotCollectCount, outpostCollectCount, fuelPassedCount, foulCommittedCount,
 *            stealCount, + all teleop toggle defaults
 *   endgame: all endgame toggle defaults
 */

import type { DataTransformation } from "@/types/game-interfaces";
import { toggles } from "./game-schema";

const AUTO_ACTION_TYPES = [
  'fuelScored', 'shotOnTheMove', 'shotStationary',
  'depotCollect', 'outpostCollect', 'fuelPassed', 'foulCommitted',
] as const;

const TELEOP_ACTION_TYPES = [
  'fuelScored', 'shotOnTheMove', 'shotStationary',
  'depotCollect', 'outpostCollect', 'fuelPassed', 'foulCommitted',
  'steal',
] as const;

function countActions(actions: any[], actionType: string): number {
  return actions.filter(a => a.actionType === actionType).length;
}

function toggleDefaults(phase: 'auto' | 'teleop' | 'endgame'): Record<string, boolean> {
  return Object.fromEntries(Object.keys(toggles[phase]).map(k => [k, false]));
}

export const gameDataTransformation: DataTransformation = {
  transformActionsToCounters(matchData) {
    const autoActions: any[] = matchData.autoActions ?? [];
    const teleopActions: any[] = matchData.teleopActions ?? [];

    // Starting position from AutoStartPage (array of booleans, true = selected)
    let startPosition: number | null = null;
    if (Array.isArray(matchData.startPosition)) {
      const idx = (matchData.startPosition as boolean[]).findIndex(p => p === true);
      if (idx >= 0) startPosition = idx;
    }

    const auto: Record<string, any> = {
      startPosition,
      ...toggleDefaults('auto'),
    };
    for (const type of AUTO_ACTION_TYPES) {
      auto[`${type}Count`] = countActions(autoActions, type);
    }

    const teleop: Record<string, any> = {
      ...toggleDefaults('teleop'),
    };
    for (const type of TELEOP_ACTION_TYPES) {
      teleop[`${type}Count`] = countActions(teleopActions, type);
    }

    const endgame: Record<string, any> = {
      ...toggleDefaults('endgame'),
    };

    return { auto, teleop, endgame };
  },

  getDefaultGameData() {
    return {
      auto: {
        startPosition: null,
        ...toggleDefaults('auto'),
        ...Object.fromEntries(AUTO_ACTION_TYPES.map(t => [`${t}Count`, 0])),
      },
      teleop: {
        ...toggleDefaults('teleop'),
        ...Object.fromEntries(TELEOP_ACTION_TYPES.map(t => [`${t}Count`, 0])),
      },
      endgame: {
        ...toggleDefaults('endgame'),
      },
    };
  },
};
