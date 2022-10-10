import pkg from "./package.json";
import typescript from "rollup-plugin-typescript2";

// continued
export default {
  input: "index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      strict: false,
    },
  ],
  plugins: [typescript({ objectHashIgnoreUnknownHack: false })],
};
