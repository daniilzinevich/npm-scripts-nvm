import {
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon
} from "vscode";

export class Script extends TreeItem {
  constructor(
    public readonly label: string,
    private path: string,
    private script: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    isInstall: boolean = false,
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.path, this.label],
    };
    this.iconPath = new ThemeIcon(isInstall ? "wrench" : "play");
  }
}
