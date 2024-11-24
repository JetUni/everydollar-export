import { existsSync, mkdirSync, writeFileSync } from "fs";

export const dataDir = "./output/";

let outputInitialized = false;

export function createDataDir() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir);
  }
}

export function saveFile(filename: string, data: string) {
  if (!outputInitialized) {
    createDataDir();
  }

  writeFileSync(dataDir + filename, data);
}
