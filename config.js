"use strict;"

module.exports = {
    /**
     * If the previous commit was made longer than `shiftIdleTime`,
     * then the next commits are going into a new `shift`.
     */
    "defaultShiftIdleTimeout": 45, // 45 min

    /**
     * If a shift duration is longer than `bulkShiftThreshold`,
     * it is considered a `SEQUENTIAL` shift type, otherwise
     * it is considered a `BULK` shift type.
     */
    "defaultBulkShiftThreshold": 10, // 15 min

    /**
     * How much time do the `BULK` shift commits count
     */
    "defaultBulkShiftValue": 7, // 10 min

    /**
     * How much time does the `SINGLE` shift commit count
     */
    "defaultSingleShiftValue": 5, // 10 min

    /**
     * Config file name
     */
    "configFileName": ".gitmon.json"
};