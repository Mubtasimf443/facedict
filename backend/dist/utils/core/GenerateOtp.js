"use strict";
/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateOtp;
function generateOtp() {
    function giveOtp() {
        let num = Math.floor(Math.random() * 1000000);
        if (num > 99999 && num < 1000000)
            return num;
        else
            return giveOtp();
    }
    return giveOtp();
}
