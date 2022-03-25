"use strict";

const git = require("simple-git")();
const userConfig = require("../get-user-config")();

const minutes2Milliseconds = minutes => minutes * 60 * 1000;

const milliseconds2Hours = milliseconds => milliseconds / (1000 * 60 * 60);

const shiftTypes = Object.freeze({
    BULK: 1,
    SEQUENTIAL: 2,
    SINGLE: 3
});

const getCommits = async () => {
    const logs = await git.log();
    const { value: email } = await git.getConfig("user.email");
    return logs.all
        .filter(log => log.author_email === email)
        .map(log => ({ ...log, date: new Date(log.date) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const getShifts = async () => {
    const { shiftIdleTimeout } = userConfig;
    const shiftIdleTimeoutMs = minutes2Milliseconds(shiftIdleTimeout);
    let shifts = [];
    let currentShift = [];
    let lastInstant;
    (await getCommits()).forEach(log => {
        const instant = log.date.getTime();
        if (!lastInstant || instant < lastInstant + shiftIdleTimeoutMs) {
            currentShift = [...currentShift, log];
            lastInstant = instant;
        } else {
            shifts = [...shifts, currentShift];
            currentShift = [log];
            lastInstant = void 0;
        }
    });
    return currentShift.length ? [...shifts, currentShift] : shifts;
};

const getShiftType = (shift) => {
    const { bulkShiftThreshold } = userConfig;
    if (shift.length === 1) {
        return shiftTypes.SINGLE;
    }
    const [first] = shift;
    const last = [...shift].pop();
    return last.date.getTime() - first.date.getTime() > bulkShiftThreshold ? shiftTypes.SEQUENTIAL : shiftTypes.BULK;
};

const calcTime = (shifts) => {
    const { bulkShiftValue, singleShiftValue } = userConfig;
    let time = 0;
    const bulkShiftValueMs = minutes2Milliseconds(bulkShiftValue);
    const singleShiftValueMs = minutes2Milliseconds(singleShiftValue);
    shifts.forEach(shift => {
        const shiftType = getShiftType(shift);
        if (shiftType === shiftTypes.BULK) {
            time += shift.length * bulkShiftValueMs;
        } else if (shiftType === shiftTypes.SINGLE) {
            time += singleShiftValueMs;
        } else if (shiftType === shiftTypes.SEQUENTIAL) {
            const [first] = shift;
            const last = [...shift].pop();
            time += last.date.getTime() - first.date.getTime();
        }
    });
    return time;
};

module.exports = async () => {
    const shifts = await getShifts();
    const time = calcTime(shifts);
    return {
        time: milliseconds2Hours(time),
        shifts: shifts
    };
};