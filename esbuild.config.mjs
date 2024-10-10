import * as esbuild from "esbuild";

await esbuild.build({
  bundle: true,
  outdir: `dist`,
  entryPoints: [
    `./src/background.ts`,
    `./src/contentScript.ts`,
    `./src/popup/**`
  ],
  loader: {
    [`.png`]: `copy`,
    [`.css`]: `copy`,
    [`.html`]: `copy`
  }
});