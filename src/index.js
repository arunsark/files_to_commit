#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const fs = require('fs');
const FileUtils = require('./util/fileUtils.js');
const validator = require('./util/validator.js');
const log = console.log;

function validate(argv) {
    if ( !validator.validateEnv(process.env) ) {
        log(chalk.bold.magenta('Environment variable COMMIT_REPOS not set'));
        process.exit();
    }
    const argsValid = validator.areArgsValid(argv);
    if ( Object.keys(argsValid).length !== 0 ) {
        log(chalk.bold.magenta(argsValid.warn));
        process.exit();
    }

    const pathValid = validator.validatePath('glide/update/customer');
    if ( Object.keys(pathValid).length !== 0 ) {
        log(chalk.bold.magenta(pathValid.warn));
        process.exit();
    }
}

function run(days, repos) {
    const fileUtils = FileUtils.create(fs);
    const srcPath = process.cwd();
    const files = fileUtils.getFiles(srcPath, days);
    if ( files.length > 0 ) {
        log(chalk.hex('#DEADED').bold('============================================='));
        log(chalk.underline.hex('#C0C0C0').bold('Found following files'));
        for ( let index in files )
            log(chalk.bold.yellowBright(files[index]));
        log(chalk.hex('#DEADED').bold('============================================='));
    }
    else {
        log(chalk.hex('#DEADED').bold('============================================='));
        log(chalk.blue.bgWhite('No files found to move'));
        log(chalk.hex('#DEADED').bold('============================================='));
    }

    const basePathMatch = srcPath.match(/(.+)\/glide\/glide\/update\/customer/);
    let netNewFiles = [];
    let multiPaths = {};

    console.log(repos);

    files.forEach(function(file){
        let paths = fileUtils.findFileTarget(file, repos);
        if ( paths.length == 0 )
            netNewFiles.push(file);
        else if ( paths.length > 1 )
            multiPaths[file] = paths;
        else {
            log(chalk.greenBright(`Moving ${file} to ${paths[0]}`));
            fileUtils.moveFile(file, srcPath, paths[0]);
        }
    });

    netNewFiles.forEach(function(file, index) {
        if ( index == 0 ) {
            log(chalk.hex('#DEADED').bold('============================================='));
            log(chalk.underline.hex('#C0C0C0').bold('New files found'));
        }
        log(chalk.yellowBright(file));
    });
    if ( netNewFiles.length > 0 )
        log(chalk.hex('#DEADED').bold('============================================='));


    Object.keys(multiPaths).forEach(function(file, index) {
        if ( index == 0 ) {
            log(chalk.hex('#DEADED').bold('============================================='));
            log(chalk.underline.hex('#C0C0C0').bold('Following files were found in multiple folders, move them manually to the right place'));
        }
        log(chalk.yellowBright(file));
        multiPaths[file].forEach( (p) => { log(chalk.whiteBright(p)); });
        log(chalk.hex('#DEADED').bold('----'));
    });

    if ( Object.keys(multiPaths).length > 0 )
        log(chalk.hex('#DEADED').bold('============================================='));

}

var argv = yargs
    .alias('d', 'days')
    .describe('d', 'last how many days to consider')
    .number('d')
    .help('help')
    .argv;

validate(argv);
log(chalk.bold.yellow('Scanning for files to commit....'));
run(validator.getNumberOfDays(argv), process.env.COMMIT_REPOS.split(':'));