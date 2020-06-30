const glob = require('glob');
const path = require('path');

module.exports = class FileUtils {

    static create(fs) {
        return new FileUtils(fs);
    }

    constructor(fs) {
        this._fs = fs;
        this.MILLISECONDS_IN_DAY = 86400000;
    }

    getFiles(path, days=9999) {
        let files = [];
        const today = new Date();
        const fileEnts = this._fs.readdirSync(path, { withFileTypes: true });
        fileEnts.forEach(entry => {
            if (!entry.isDirectory()) {
                let stats = this._fs.statSync(`${path}/${entry.name}`);
                let mTime = new Date(stats.mtime);
                if ( (today.getTime() - mTime.getTime()) <= (this.MILLISECONDS_IN_DAY * days) )
                   files.push(entry.name);
            }
        });
        return files;
    }

    getPathToAppend(path) {
        const fileEnts = this._fs.readdirSync(path, { withFileTypes: true });
        let subDir;
        for ( let i=0; i<fileEnts.length; i++ ) {
            if (fileEnts[i].isDirectory() && fileEnts[i].name === 'src')
                return '/src/main/plugins';
            else if ( fileEnts[i].isDirectory() )
                subDir = fileEnts[i].name;
        };
        return `/${subDir}/src/main/plugins`;
    }

    findFileTarget(file, targetPath, foldersToInclude) {
        let entries = this._fs.readdirSync(targetPath, {withFileTypes: true});
        let dirs = [];
        let entryPath = '';
        entries.forEach(function(entry) {
            if ( entry.isDirectory() && foldersToInclude.indexOf(entry.name) !== -1 ) {
                entryPath = targetPath + '/' + entry.name;
                dirs.push(entryPath + this.getPathToAppend(entryPath));
            }
        }, this);

        let paths = [];
        dirs.forEach(function(dir) {
            glob.sync(`**/${file}`, {cwd: dir}).map(function(target) {
                paths.push(`${dir}/${path.dirname(target)}`);
            });
        });
        return paths;
    }

    moveFile(file, srcPath, destPath) {
        this._fs.renameSync(`${srcPath}/${file}`, `${destPath}/${file}`);
    }
}