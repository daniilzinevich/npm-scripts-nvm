import * as vscode from "vscode";
import { NpmScriptsProvider } from "./NpmScriptsProvider";
import { fileExists } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

    fileExists("package.json", rootPath, (isExists) => {
      vscode.commands.executeCommand(
        "setContext",
        "workspaceHasPackageJSON",
        isExists
      );
    })

  const npmScriptsProvider = new NpmScriptsProvider(vscode.workspace.workspaceFolders);

  vscode.window.createTreeView("npm-scripts-nvm.npmScripts", {
    treeDataProvider: npmScriptsProvider,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-nvm.runNpmScript",
      (path, script) => {
        vscode.tasks.executeTask(
          new vscode.Task(
            { type: "shell" },
            vscode.TaskScope.Global,
            script,
            "npm", // TODO: replace with real executioner
            new vscode.ShellExecution(script, { cwd: path })
          )
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-nvm.refreshScripts",
      npmScriptsProvider.refresh.bind(npmScriptsProvider)
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
