// Regenerates the DiceBear portraits in src/Assets/avatar/.
// Run with `npm run avatars` after changing an option below. The SVGs are
// committed, so the site ships two small files instead of the DiceBear runtime.
import { writeFileSync, mkdirSync } from "node:fs";
import { createAvatar } from "@dicebear/core";
import * as avataaars from "@dicebear/avataaars";

const BASE = {
  seed: "Patrick",
  skinColor: ["614335"],
  top: ["shortFlat"],
  hairColor: ["2c1b18"],
  eyebrows: ["defaultNatural"],
  mouth: ["smile"],
  clothing: ["shirtCrewNeck"],
  clothesColor: ["25557c"],
  facialHairProbability: 0,
  accessoriesProbability: 0,
};

const out = new URL("../src/Assets/avatar/", import.meta.url);
mkdirSync(out, { recursive: true });
for (const [name, eyes] of [["wave", "happy"], ["bye", "wink"]]) {
  const svg = createAvatar(avataaars, { ...BASE, eyes: [eyes] }).toString();
  writeFileSync(new URL(`${name}.svg`, out), svg);
  console.log(`wrote ${name}.svg (${svg.length} bytes)`);
}
