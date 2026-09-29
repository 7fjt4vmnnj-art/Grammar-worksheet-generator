export const NAMES = [
  "Maya",
  "Jordan",
  "Aisha",
  "Luis",
  "Priya",
  "Noah",
  "Elena",
  "Kai",
  "Rosa",
  "Omar",
  "Lena",
  "Theo",
  "Hana",
  "Miles",
  "Imani",
  "Caleb",
  "Sofia",
  "Devon",
  "Naomi",
  "Arjun",
] as const;

export type PersonName = (typeof NAMES)[number];
