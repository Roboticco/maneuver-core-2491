/**
 * 2026 REBUILT — QR export: maps a Maneuver scouting entry to a tab-delimited
 * string matching scout.2491nomythic.org column order (version 9/29/26.1).
 *
 * Column codes are the "code" values from the QRScout config in section order.
 * The Google Sheet must have matching headers for the scan-to-paste workflow.
 *
 * Approximations (marked with ~):
 * - `robot` driver station: Maneuver stores alliance color only, not station #.
 *   Output is "R1"/"B1" — scouts should note station separately if needed.
 * - `Auto` preloaded fuel: QRScout defaults to 8, not tracked live; hardcoded 8.
 * - Teleop shift breakdown: Maneuver counts total teleop fuel, not per-shift.
 *   Total goes in TeleTransitionScored; other shift columns output 0.
 * - `AutoNeutralEntry`, `PassingTypeTele`, `FuelPickupTele`: not tracked; output "".
 * - `AutoFuelLeftRobot`, `AutoFuelLeftDepot`, `AutoFuelLeftOutpost`: estimates,
 *   not tracked; output QRScout defaults (0, 24, 24).
 */

import { buildTabDelimitedString } from '@/core/lib/singleQrExport';

type ScoutingEntry = Record<string, unknown>;
type PhaseData = Record<string, unknown>;

// Map 5-position index (0=trench1, 1=bump1, 2=hub, 3=bump2, 4=trench2)
// to QRScout's 3-position select values.
function mapStartPosition(pos: unknown): string {
  switch (pos) {
    case 0: return 'Trench'; // trench1 (upper)
    case 1: return 'Bump';   // bump1 (upper)
    case 2: return 'Hub';    // hub (center)
    case 3: return 'Bump';   // bump2 (lower)
    case 4: return 'Trench'; // trench2 (lower)
    default: return '';
  }
}

// Map matchKey prefix to QRScout MatchType select value.
function mapMatchType(matchKey: unknown): string {
  if (typeof matchKey !== 'string') return 'Qualifications';
  if (matchKey.startsWith('qm')) return 'Qualifications';
  return 'Practice';
}

// Map endgame climb toggles to QRScout EndClimb select key.
function mapEndClimb(endgame: PhaseData): string {
  if (endgame.climbL3 === true || (endgame.climbL3Count as number) > 0) return 'L3';
  if (endgame.climbL2 === true || (endgame.climbL2Count as number) > 0) return 'L2';
  if (endgame.climbL1 === true || (endgame.climbL1Count as number) > 0) return 'L1';
  if (endgame.climbFailed === true || (endgame.climbFailedCount as number) > 0) return 'Failed';
  return 'None';
}

// Multi-select: join truthy entries with commas (QRScout format).
function multiSelect(...pairs: [boolean | unknown, string][]): string {
  return pairs
    .filter(([val]) => val === true || (typeof val === 'number' && val > 0))
    .map(([, label]) => label)
    .join(',');
}

export function serializeEntryToQrString(entry: ScoutingEntry): string {
  const gameData = (entry.gameData ?? {}) as Record<string, PhaseData>;
  const auto = (gameData.auto ?? {}) as PhaseData;
  const teleop = (gameData.teleop ?? {}) as PhaseData;
  const endgame = (gameData.endgame ?? {}) as PhaseData;

  const autoFuelScored = (auto.fuelScoredCount as number) ?? 0;
  const teleopFuelScored = (teleop.fuelScoredCount as number) ?? 0;
  const autoClimbed = (auto.autoClimbCount as number) > 0;
  const dto = ((auto.brokenDownCount as number) > 0) || ((teleop.brokenDownCount as number) > 0);

  // AutoPickupLocations multi-select
  const autoPickup = multiSelect(
    [(auto.depotCollectCount as number) > 0, 'Depot'],
    [(auto.outpostCollectCount as number) > 0, 'Outpost'],
  );

  // BumpOrTrenchTele multi-select (from endgame teleop-traversal toggles)
  const bumpTrenchTele = multiSelect(
    [endgame.usedBumpInTeleop, 'Bump'],
    [endgame.usedTrenchInTeleop, 'Trench'],
  );

  // PassingTele multi-select (from endgame passing-zone toggles)
  const passingTele = multiSelect(
    [endgame.passedToAllianceFromNeutral, 'Neutral-Alliance'],
    [endgame.passedToNeutral, 'Oppo-Neutral'],
    [endgame.passedToAllianceFromOpponent, 'Oppo-Alliance'],
  );

  // ~ Fuel-passed estimate bucket (from teleop fuelPassedCount)
  const passed = (teleop.fuelPassedCount as number) ?? 0;
  let telePassedAmount = '0';
  if (passed > 400) telePassedAmount = '400';
  else if (passed > 300) telePassedAmount = '350';
  else if (passed > 200) telePassedAmount = '250';
  else if (passed > 100) telePassedAmount = '150';
  else if (passed > 70) telePassedAmount = '85';
  else if (passed > 40) telePassedAmount = '55';
  else if (passed > 10) telePassedAmount = '25';
  else if (passed > 0) telePassedAmount = '5';

  const values: (string | number | boolean | null | undefined)[] = [
    // ── Prematch-1 ───────────────────────────────────────────────────────────
    entry.scoutName as string,                         // scouter
    'NoMythic',                                        // scouter team
    mapMatchType(entry.matchKey),                      // MatchType
    entry.matchNumber as number,                       // matchNumber

    // ── Prematch-2 ───────────────────────────────────────────────────────────
    entry.teamNumber as number,                        // teamNumber
    (entry.allianceColor as string) === 'red' ? 'R1' : 'B1', // ~ robot (station unknown)
    !((entry.noShow as boolean) ?? false),             // noShow → Robot Present (inverted)
    mapStartPosition(auto.startPosition),              // start
    false,                                             // broken (before match — not tracked)
    8,                                                 // ~ Auto (preloaded fuel, default)

    // ── Auto-1 ───────────────────────────────────────────────────────────────
    0,                                                 // ~ MissedFuelAuto (not tracked)
    '0',                                               // ~ AutoFuelLeftRobot (not tracked)
    autoPickup,                                        // AutoPickupLocations
    24,                                                // ~ AutoFuelLeftDepot (default)
    24,                                                // ~ AutoFuelLeftOutpost (default)

    // ── Auto-2 ───────────────────────────────────────────────────────────────
    '',                                                // ~ AutoNeutralEntry (not tracked)
    (auto.foulCommittedCount as number) > 0 ? 'Fully' : 'No', // CenterLineAuto (foul = crossed)
    autoClimbed ? 'Yes' : 'No',                        // ClimbAuto
    '',                                                // AutoComments

    // ── Teleop-General 1 ─────────────────────────────────────────────────────
    false,                                             // ~ StuckClimbTele (not tracked)

    // ── Teleop-General 2 ─────────────────────────────────────────────────────
    bumpTrenchTele,                                    // BumpOrTrenchTele

    // ── Teleop-General 3 ─────────────────────────────────────────────────────
    passingTele,                                       // PassingTele
    telePassedAmount,                                  // ~ TelePassedAmount (estimated)
    '',                                                // ~ PassingTypeTele (not tracked)

    // ── Teleop-General 4 ─────────────────────────────────────────────────────
    '',                                                // ~ FuelPickupTele (not tracked)
    (endgame.defendedAgainst as boolean) ?? false,     // DefendedAgainst

    // ── Transition Shift (using total teleop fuel here) ───────────────────────
    teleopFuelScored,                                  // ~ TeleTransitionScored (total teleop)
    0,                                                 // TeleTransitionMissed
    0,                                                 // TeleTransitionCycles

    // ── 1st Scoring Shift ────────────────────────────────────────────────────
    0,                                                 // Tele1stShiftScored
    0,                                                 // Tele1stShiftMissed
    0,                                                 // Tele1stShiftCycles

    // ── 2nd Scoring Shift ────────────────────────────────────────────────────
    0,                                                 // Tele2ndShiftScored
    0,                                                 // Tele2ndShiftMissed
    0,                                                 // Tele2ndShiftCycles

    // ── Endgame Scoring ──────────────────────────────────────────────────────
    autoFuelScored,                                    // ~ TeleEndgameScored (auto fuel total)
    0,                                                 // TeleEndgameMissed
    0,                                                 // TeleEndgameCycles

    // ── Endgame ───────────────────────────────────────────────────────────────
    mapEndClimb(endgame),                              // EndClimb
    '',                                                // endco

    // ── Postmatch-1 ──────────────────────────────────────────────────────────
    'None',                                            // ~ Cards (not tracked)
    entry.comments as string,                          // PostComments

    // ── Postmatch-2 ──────────────────────────────────────────────────────────
    dto,                                               // broken (post-match — from brokenDown)
    dto,                                               // dto (robot disabled)
    '0',                                               // VersionID (→ "9/29/26.1")
  ];

  return buildTabDelimitedString(values);
}
