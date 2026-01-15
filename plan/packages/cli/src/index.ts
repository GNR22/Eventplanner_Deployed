#!/usr/bin/env node

import { Command } from 'commander';
import $ from "execa";

const GIT_REPO = "https://github.com/1997roylee/create-t3-turbo.git"
const program = new Command();

program
    .name('create-t3-turbo')
    .description('CLI to create a new T3 APP with Turbo Monorepo')
    .version('1.0.0');


program
    .argument('<app-name>', 'Name of the app')
// .option('-s, --separator <char>');

program.parse();

// const options = program.opts();

(async () => {
    try {
        const appName = program.args[0];
        console.log('Downloading files...');
        await $(`git clone --depth 1 ${GIT_REPO} ${appName}`);
        await $(`npx rimraf ./.git`)
        await $(`npx rimraf ./bin`)
        console.log('The installation is done, this is ready to use !');
    } catch (error) {
        // Catch any error
        console.warn(error);
    }
})();