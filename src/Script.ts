import {
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon
} from "vscode";
import { buildInstallScript, buildScript } from "./utils";

export class Script extends TreeItem {
  constructor(
    public readonly label: string,
    protected path: string,
    protected script: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.path, buildScript(label, this.path)],
    };
  }

  iconPath = new ThemeIcon("play");
}

export class InstallScript extends Script {
  constructor(
    public readonly label: string,
    protected path: string,
    protected script: string
  ) {
    super(label, path, script);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.path, buildInstallScript(this.path)],
    };
  }
  
  iconPath = new ThemeIcon("wrench");
}
