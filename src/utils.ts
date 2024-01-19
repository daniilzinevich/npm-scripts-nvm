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

const scriptWrapper = (rootPath: string, callback: () => void) => {
  const scripts = [];

  // TODO: add support for other config files (bashrc, bash_profile, ...?)
  if (pathExists(".zshrc", homedir())) {
    scripts.push(`source ${path.join(homedir(), ".zshrc")}`);
  }

  // TODO: check if nvm is installed
  if (pathExists(".nvmrc", rootPath)) {
    scripts.push("nvm use");
  }

  scripts.push(callback());

  return scripts.join(" && ");
}

const scripts = {
  yarn: {
    install: "yarn install",
    run: (script: string) => `yarn ${script}`,
  },
  pnpm: {
    install: "pnpm install",
    run: (script: string) => `pnpm run ${script}`,
  },
  npm: {
    install: "npm install",
    run: (script: string) => `npm run ${script}`,
  },
};

export const executioner = (rootPath: string) =>
  pathExists("yarn.lock", rootPath)
    ? "yarn"
    : pathExists("pnpm-lock.yaml", rootPath)
    ? "pnpm"
    : "npm";

export const buildInstallScript = (rootPath: string) => {
  return scriptWrapper(rootPath, () => scripts[executioner(rootPath)].install);
};

export const buildScript = (script: string, rootPath: string) => {
  return scriptWrapper(rootPath, () => scripts[executioner(rootPath)].run(script));
};
