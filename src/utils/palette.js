// Bright, kid-friendly colour rotation for cards. Used via inline styles so
// Tailwind's JIT never has to see dynamic class names.
export const PALETTE = [
  { bg: '#8b5cf6', soft: '#ede9fe', emoji: '🦄' }, // grape
  { bg: '#ec4899', soft: '#fce7f3', emoji: '🌸' }, // bubblegum
  { bg: '#fb923c', soft: '#ffedd5', emoji: '🦊' }, // tangerine
  { bg: '#38bdf8', soft: '#e0f2fe', emoji: '🐬' }, // sky
  { bg: '#34d399', soft: '#d1fae5', emoji: '🐢' }, // grass
  { bg: '#fbbf24', soft: '#fef3c7', emoji: '🌟' }, // sun
  { bg: '#f87171', soft: '#fee2e2', emoji: '🍓' }, // cherry
  { bg: '#a78bfa', soft: '#f3e8ff', emoji: '🎈' }, // lavender
];

export const colorAt = (i) => PALETTE[((i % PALETTE.length) + PALETTE.length) % PALETTE.length];
