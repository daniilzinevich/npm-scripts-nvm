import { accessSync } from "fs";
import * as path from "path";

export const pathExists = (p: string, rootPath: string) => {
  try {
    accessSync(path.join(rootPath, p));
  } catch {
    return false;
  }
  return true;
};

export const buildScriptText = (script: string, rootPath: string) => {
  const scripts = [];

  // TODO: add support for other config files (bashrc, bash_profile, ...?)
  if (pathExists("~/.zshrc", rootPath)) {
    scripts.push("source ~/.zshrc");
  }

  // TODO: check if nvm is installed
  if (pathExists(".nvmrc", rootPath)) {
    scripts.push("nvm use");
  }

  if (pathExists("yarn.lock", rootPath)) {
    scripts.push(`yarn ${script}`);
  } else if (pathExists("pnpm-lock.yaml", rootPath)) {
    scripts.push(`pnpm run ${script}`);
  } else {
    scripts.push(`npm run ${script}`);
  }

  return scripts.join(" && ");
};
