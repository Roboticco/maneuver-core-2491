/**
 * Single-QR export utility — pure tab-delimited serialization.
 *
 * Game-template code (src/game-template/qr-export.ts) builds the ordered
 * value array; this file only handles the final join.
 */

export function buildTabDelimitedString(values: (string | number | boolean | null | undefined)[]): string {
  return values
    .map(v => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'boolean') return v ? 'true' : 'false';
      return String(v);
    })
    .join('\t');
}
