// One-off: tags each kaiwa scenario with a `category` id so Kaiwa Lab can
// group 34 scenarios into a handful of labeled sections instead of one
// long list.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "kaiwa-scenarios.json");

const categoryByIndex = {
  1: "arrival", 5: "arrival", 10: "arrival", 11: "arrival", 12: "arrival", 13: "arrival", 18: "arrival",
  0: "food", 7: "food", 14: "food", 15: "food",
  3: "errands", 20: "errands", 21: "errands", 22: "errands", 25: "errands",
  6: "trouble", 17: "trouble", 19: "trouble",
  4: "social", 8: "social", 9: "social", 26: "social", 27: "social", 28: "social", 32: "social", 33: "social",
  2: "daily", 16: "daily", 23: "daily", 24: "daily", 29: "daily", 30: "daily", 31: "daily",
};

const scenarios = JSON.parse(fs.readFileSync(dataPath, "utf8"));
if (Object.keys(categoryByIndex).length !== scenarios.length) {
  throw new Error(`mapped ${Object.keys(categoryByIndex).length} of ${scenarios.length} scenarios`);
}
scenarios.forEach((sc, i) => {
  if (!categoryByIndex[i]) throw new Error(`no category for index ${i}`);
  sc.category = categoryByIndex[i];
});

fs.writeFileSync(dataPath, JSON.stringify(scenarios, null, 2), "utf8");
console.log("Tagged", scenarios.length, "scenarios with categories.");
