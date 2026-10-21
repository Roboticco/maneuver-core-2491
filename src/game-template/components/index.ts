/**
 * Game-Template Component Exports
 *
 * Path-tracking components (AutoFieldMap, TeleopFieldMap, field-map) are not
 * included — this fork uses a button-counter scoring interface instead.
 */

// Auto Start Page Components
export { AutoStartFieldSelector } from './auto-start';

// Game Start Page Components
export { GameSpecificScoutOptions } from './game-start';

// Pit Scouting Page Components
export { GameSpecificQuestions } from './pit-scouting';

// Scoring Page Components (used by both Auto and Teleop)
export { ScoringSections, StatusToggles } from './scoring';
export { PostClimbProceed } from './scoring/PostClimbProceed';
