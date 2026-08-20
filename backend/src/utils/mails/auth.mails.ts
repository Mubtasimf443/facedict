/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { SMTP_USER } from "../../config/env";
import { mailer } from "../../config/mailer";

export default async function sendVerificationOTP(userEmail: string, otp: number) {
    try {
        const info = await mailer.sendMail({
            from: `"facedict" <${SMTP_USER}>`,
            to: userEmail,
            subject: `${otp} is your facedict verification code`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333333; text-align: center;">Welcome to facedict!</h2>
        <p style="color: #555555; font-size: 16px;">Thank you for signing up. Please use the verification code below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; background-color: #f4f6f9; padding: 10px 20px; border-radius: 6px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #777777; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="color: #999999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} facedict. All rights reserved.</p>
      </div>
    `
        });
        console.log('Verification email sent: %s', info.messageId);
        return true
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false
    }
}