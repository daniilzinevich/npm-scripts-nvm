import { ThemeIcon, WorkspaceFolder } from "vscode";
import { buildInstallScript } from "./utils";
import { Script } from "./Script";


export class InstallScript extends Script {
  constructor(
    public readonly label: string,
    protected root: WorkspaceFolder,
    protected script: string
  ) {
    super(label, root, script);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.root, buildInstallScript(this.root.uri.fsPath)],
    };
  }

  iconPath = new ThemeIcon("wrench");
}
