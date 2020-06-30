function areArgsValid(argv) {
    if ( argv.d && isNaN(argv.d) )
        return { warn: 'Not valid days' };
    else
        return {};
}

function getNumberOfDays(argv) {
    if ( !!argv.d  && !isNaN(argv.d) )
        return argv.d;
    else
        return 1;
}

function validatePath(expectedPath) {
    const cwd = process.cwd();
    const expectedPathRegex = new RegExp(expectedPath);
    if ( cwd.match(expectedPathRegex) )
        return {}
    else
        return { warn: `Not running in the correct path. Run it from ${expectedPath}` }
}

function validateEnv(env) {
    return (!!env.COMMIT_REPOS);
}

module.exports = {
    areArgsValid,
    getNumberOfDays,
    validatePath,
    validateEnv
}