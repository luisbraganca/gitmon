#!/usr/bin/env node

"use strict";
const getWorkingTime = require("../src/get-working-time");
const getUserConfig = require("../src/get-user-config");

(async () => {
    const userConfig = getUserConfig();
    if (!userConfig) {
        return console.log("Config not set, run 'gitmon-setup' first.");
    }
    const { shifts, time } = await getWorkingTime();
    console.log(`You worked ${shifts.length} shift(s), for a total of ${time.toFixed(2)} hour(s).`);
    console.log(`Your salary is ${(userConfig.salary * time).toFixed(2)} ${userConfig.unit}`)
})();