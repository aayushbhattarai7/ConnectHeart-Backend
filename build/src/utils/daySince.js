"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daySince = daySince;
function daySince(dateString) {
    if (isNaN(new Date(dateString).getTime())) {
        return 'Invalid Date';
    }
    //Convert input to Date object
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const daysDifference = Math.floor(timeDifference / 1000 * 3600 * 24);
    return daysDifference;
}
