import { rename, access } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const api = fileURLToPath(new URL("../app/api", import.meta.url));
const hidden = fileURLToPath(new URL("../app/.api-hidden", import.meta.url));

let moved = false;
try {
  await access(api);
  await rename(api, hidden);
  moved = true;
} catch {
  // No API folder to hide during the static export.
}

const child = spawn("npx", ["next", "build", "--webpack"], {
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
  shell: process.platform === "win32",
});

child.on("exit", async (code) => {
  if (moved) {
    try {
      await rename(hidden, api);
    } catch {
      // Leave the folder where it is if restore fails; the next run will retry.
    }
  }
  process.exit(code ?? 1);
});
