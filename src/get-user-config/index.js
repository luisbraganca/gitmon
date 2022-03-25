"use strict";

const { loadLocalUserConfig, loadGlobalUserConfig } = require("../util");

module.exports = () => {
    return loadLocalUserConfig() || loadGlobalUserConfig();
};