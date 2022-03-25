"use strict";

const fs = require("fs").promises;
const path = require("path");
const { configFileName } = require("../../config");

module.exports.loadLocalUserConfig = () => {
    try {
        return require(path.join(process.cwd(), configFileName));
    } catch (ignored) {
        return void 0;
    }
};

module.exports.loadGlobalUserConfig = () => {
    try {
        return require(path.join(__dirname, "..", "..", configFileName));
    } catch (ignored) {
        return void 0;
    }
};

module.exports.saveLocalUserConfig = async (userConfig) => {
    await fs.writeFile(path.join(process.cwd(), configFileName), JSON.stringify(userConfig, void 0, 4));
};

module.exports.saveGlobalUserConfig = async (userConfig) => {
    await fs.writeFile(path.join(__dirname, "..", "..", configFileName), JSON.stringify(userConfig, void 0, 4));
};
