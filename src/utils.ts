import { accessSync } from "fs";
import { homedir } from "os";
import * as path from "path";
import * as glob from "glob";

export const fileExists = (filename: string, rootPath: string, callback: (value: boolean) => void) => {
  glob(`${rootPath}/**/${filename}`, {}, (err) => {
    if (err) {
      callback(false)
    } else {
      callback(true)
    }
  })
}

export const pathExists = (filename: string, rootPath: string) => {
  try {
    accessSync(path.join(rootPath, filename));
  } catch {
    return false;
  }
  return true;
};

export const buildScriptText = (script: string, rootPath: string) => {
  const scripts = [];

  // TODO: add support for other config files (bashrc, bash_profile, ...?)
  if (pathExists(".zshrc", homedir())) {
    scripts.push(`source ${path.join(homedir(), ".zshrc")}`);
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
