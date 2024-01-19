import {
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon,
  WorkspaceFolder
} from "vscode";
import { buildScript } from "./utils";

export class Script extends TreeItem {
  constructor(
    public readonly label: string,
    protected root: WorkspaceFolder,
    protected script: string
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.root, buildScript(label, this.root.uri.fsPath)],
    };
  }

  iconPath = new ThemeIcon("play");
}
