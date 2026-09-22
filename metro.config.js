// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
let realProjectRoot = projectRoot;
try {
  realProjectRoot = fs.realpathSync(projectRoot);
} catch (e) {
  realProjectRoot = projectRoot;
}

const watchFolders = Array.from(
  new Set([
    projectRoot,
    realProjectRoot,
    path.resolve(realProjectRoot, 'node_modules'),
    path.resolve(projectRoot, 'node_modules'),
  ]),
);

const config = {
  projectRoot: projectRoot,
  watchFolders: watchFolders,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);