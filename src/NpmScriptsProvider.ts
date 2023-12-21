import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  EventEmitter,
  WorkspaceFolder,
} from "vscode";
import { readFileSync } from "fs";
import * as path from "path";

import { Script } from "./Script";
import { buildInstallScript } from "./utils";

export class NpmScriptsProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new EventEmitter<Script | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private workspaceFolders?: readonly WorkspaceFolder[]) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(item: TreeItem): TreeItem {
    return item;
  }

  getChildren(item?: TreeItem): TreeItem[] {
    if(item) {
      return this.getScripts(item.label as string);
    } else {
      const projects = this.getProjects();
      return projects.length === 1
        ? this.getScripts(projects[0].label as string)
        : projects;
    } 
  }

  private getProjects(): TreeItem[] {
    return this.workspaceFolders?.map(
      (workspaceRoot) =>
        new TreeItem(workspaceRoot.name, TreeItemCollapsibleState.Collapsed,)
    ) ?? [];
  }

  private getScripts(folderName: string): Script[] {
    return (
      this.workspaceFolders?.reduce<Script[]>((scripts, workspaceRoot) => {
        if (folderName !== workspaceRoot.name) {
          return scripts;
        }
        // TODO: use glob to search for subprojects
        const packageJsonPath = path.join(
          workspaceRoot.uri.fsPath,
          "package.json"
        );
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

        return scripts.concat(
          new Script(
            'Run install',
            workspaceRoot.uri.fsPath,
            buildInstallScript(workspaceRoot.uri.fsPath),
            TreeItemCollapsibleState.None,
            true
          ),
          Object.entries<string>(packageJson.scripts).map(
            ([label, script]) =>
              new Script(
                label,
                workspaceRoot.uri.fsPath,
                script,
                TreeItemCollapsibleState.None
              )
          )
        );
      }, []) ?? []
    );
  }
}
