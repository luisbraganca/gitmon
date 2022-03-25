"use strict";

const prompts = require("prompts");
const {
    loadGlobalUserConfig,
    loadLocalUserConfig,
    saveGlobalUserConfig,
    saveLocalUserConfig
} = require("../util");
const { defaultShiftIdleTimeout, defaultBulkShiftThreshold, defaultBulkShiftValue, defaultSingleShiftValue } = require("../../config");

const defaultOnCancel = () => true;

module.exports = async () => {
    const promptValues = await prompts(
        [
            {
                type: "number",
                name: "salary",
                message: "Salary/hour:",
                float: true,
                validate: value => value > 0.0 ? true : "Salary must be a positive number"
            },
            {
                type: "text",
                name: "unit",
                message: "Salary unit:",
                validate: value => value.length ? true : "Unit should not be empty"
            },
            {
                type: "number",
                name: "shiftIdleTimeout",
                message: "Shift idle timeout - Max allowed idle time between same-shift commits (min):",
                initial: defaultShiftIdleTimeout,
                min: 1
            },
            {
                type: "number",
                name: "bulkShiftThreshold",
                message: "Bulk shift threshold - If a shift duration is longer than 'bulkShiftThreshold', it will be treated as a 'SEQUENTIAL' shift type, otherwise it will be treated either as a 'BULK' or a 'SINGLE', depending on the commit amount (min):",
                initial: defaultBulkShiftThreshold,
                min: 1
            },
            {
                type: "number",
                name: "bulkShiftValue",
                message: "Bulk shift value - How much time do the 'BULK' shift commits weight (min):",
                initial: defaultBulkShiftValue,
                min: 1
            },
            {
                type: "number",
                name: "singleShiftValue",
                message: "Single shift value - How much time does the 'SINGLE' shift commit weight (min):",
                initial: defaultSingleShiftValue,
                min: 1
            }
        ],
        { onCancel: defaultOnCancel }
    );
    const { value: local } = await prompts(
        {
            type: "select",
            name: "value",
            message: "Store the setup file:",
            choices: [
                { title: "Locally", value: true, description: "This project only" },
                { title: "Globally", value: false, description: "The default value for all the projects" }
            ],
            initial: 1
        },
        { onCancel: defaultOnCancel }
    );
    if (local) {
        let userConfig = loadLocalUserConfig();
        await saveLocalUserConfig({ ...userConfig, ...promptValues });
    } else {
        let userConfig = loadGlobalUserConfig();
        await saveGlobalUserConfig({ ...userConfig, ...promptValues });
    }
};
