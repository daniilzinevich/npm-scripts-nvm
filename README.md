# npm-scripts-nvm README

**Extension to run npm scripts with NVM**

## Installation
Install through VS Code extensions. Search for `NPM Scripts NVM`
 
> You can hide builtin NPM Scripts view by right clicking on it

## Features

- Add NPM Scripts view in explorer view
  - It's similar to builtin NPM Scripts view, but applies necessary node version before running
  - It executes `nvm use` if there is `.nvmrc` file in root directory
- Currently supports NPM, PNPM and Yarn
- Provides install script for given package manager and node version
- For multi-repo workspaces provides tree view with set of commands for each project
