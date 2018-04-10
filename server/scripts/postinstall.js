require('babel-core/register');
require('babel-polyfill');

import {execSync} from 'child_process';
import fs from 'fs';
import Logger from '../src/components/logger';

const rootPath = `${__dirname}/..`;
const logger = new Logger({
    level: 'info',
    debugFile: `${rootPath}/logs/debug.log`,
    infoFile: `${rootPath}/logs/info.log`,
    warnFile: `${rootPath}/logs/warn.log`,
    errorFile: `${rootPath}/logs/error.log`,
});

/**
 * Copies a sample config file to live
 * @param  {String} name Name of the config file
 */
function checkConfigFile(name) {
    if (name[0] === '.') {
        return;
    }

    if (!fs.existsSync(`${rootPath}/config/${name}`)) {
        logger.warn(`Missing ${name} config file, generating..`);
        return execSync(`cp -n ${rootPath}/config/samples/${name} ${rootPath}/config/${name}`);
    } else {
        logger.info(`Found ${name} config, skipping..`);
    }
}

// Setup .env file is not found
if (!fs.existsSync(`${rootPath}/.env`)) {
    logger.warn('Missing .env file, generating..');
    execSync(`cp -n ${rootPath}/.env.sample ${rootPath}/.env`);
} else {
    logger.info('.env file found, skipping..');
}

// check if the config directory is setup
logger.info('Checking for missing config files..');
fs.readdirSync(`${rootPath}/config/samples/`).forEach((file) => {
    checkConfigFile(file);
});
