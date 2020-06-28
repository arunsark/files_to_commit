#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const chalk = require('chalk');
const findUp = require('find-up');
const fs = require('fs');
const glob = require('glob');

var argv = yargs
  .alias('d', 'days')
  .describe('d', 'last how many days to consider')
    .number('d')
  .alias('i', 'include-files')
  .describe('i', 'file patterns to include')
 .choices('i', ['sys_script', 'sys_script_include'])
    .array('i')
  .help('help')
  .argv



const log = console.log;


log(chalk.bold.red('I choose the files...You build the code...'));

const warning = chalk.keyword('orange');
log(warning('Warning! '+argv.d + ' '+argv.i[0]+' '+argv.i[1]));

log(process.cwd() +' '+path.dirname(process.cwd() +'/')+' '+path.basename(process.cwd()+'/'));

const cwd = process.cwd();
const fullPath = `${path.dirname(cwd)}/${path.basename(cwd)}`
log(chalk.blue(fullPath));
if ( fullPath.match(/.*glide\/update\/customer$/) ) {
    log(chalk.bold.green('In right path'));
//    process.exit();
}


var files = [];
fs.readdir(fullPath, function(err, items) {
    let today = new Date();
    for (var i=0; i<items.length; i++) {
	let stats = fs.statSync(items[i]);
	let d = new Date(stats.mtime);
	if ( (today.getTime() - d.getTime()) <= (86400000*8) ) {
	    console.log(`File modified ${stats.mtime} ${items[i]} ago`);
	    files.push(items[i]);
	}
    }
    const swd = 'glide';
    files.forEach(function(file) {
	log(chalk.underline(`Glob output ${file}`));
	glob(`**/${file}`, {cwd: '/Users/arun.vydianathan/master/app-spend-catalog/src/main/plugins'}, function(err, matches) {
	    if ( matches.length == 1 ) {
		let dest = '/Users/arun.vydianathan/master/app-spend-catalog/src/main/plugins/' + path.dirname(matches[0]);
		log(`Moving ${file} to ${dest}`);
		fs.renameSync(file, dest + '/' + file);
	    }
	});
    });
});

let dirs = [];
fs.readdir('/Users/arun.vydianathan/master', {withFileTypes: true}, function(err, fileEnts) {
    fileEnts.forEach(function(entry) {
	if ( entry.isDirectory() && entry.name !== 'glide' )
	    dirs.push('/Users/arun.vydianathan/master' + entry.name);
    });
});






log('CWD '+process.cwd());
//log(chalk.magenta(entry.isDirectory()) +' ' + chalk.yellowBright(entry.name));
