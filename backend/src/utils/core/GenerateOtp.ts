/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

export default function generateOtp() :number {
    function giveOtp() : number {
        let num = Math.floor(Math.random() * 1000000);
        if (num > 99999 && num < 1000000) return num;
        else return giveOtp()
    }
    return giveOtp();
}