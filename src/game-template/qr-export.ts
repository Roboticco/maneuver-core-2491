/**
 * Game-template QR export — maps a scouting entry to a tab-delimited string.
 *
 * Column order here must match the Google Sheet's column headers exactly.
 * When customizing for a game year, update the column list alongside game-schema.ts.
 */

import { buildTabDelimitedString } from '@/core/lib/singleQrExport';

type ScoutingEntry = Record<string, unknown>;
type GameData = Record<string, Record<string, unknown>>;

export function serializeEntryToQrString(entry: ScoutingEntry): string {
  const gameData = (entry.gameData ?? {}) as GameData;
  const auto = gameData.auto ?? {};
  const teleop = gameData.teleop ?? {};
  const endgame = gameData.endgame ?? {};

  const values: (string | number | boolean | null | undefined)[] = [
    // Identity
    entry.scoutName as string,
    entry.matchNumber as number,
    entry.teamNumber as number,
    entry.allianceColor as string,
    entry.eventKey as string,
    entry.noShow as boolean ?? false,

    // Auto
    auto.startPosition as number ?? '',
    auto.action1Count as number ?? 0,
    auto.action2Count as number ?? 0,
    auto.action3Count as number ?? 0,
    auto.action4Count as number ?? 0,
    auto.autoToggle as boolean ?? false,

    // Teleop
    teleop.action1Count as number ?? 0,
    teleop.action2Count as number ?? 0,
    teleop.action3Count as number ?? 0,
    teleop.action4Count as number ?? 0,
    teleop.teleopSpecialCount as number ?? 0,
    teleop.teleopToggle as boolean ?? false,

    // Endgame
    endgame.option1 as boolean ?? false,
    endgame.option2 as boolean ?? false,
    endgame.option3 as boolean ?? false,
    endgame.toggle1 as boolean ?? false,
    endgame.toggle2 as boolean ?? false,

    // Comments
    entry.comments as string ?? '',
  ];

  return buildTabDelimitedString(values);
}
