import { rollupTypescript } from "../../scripts/rollup.js";

export default rollupTypescript("index", {
  external: ["node:fs", "upath"],
});
