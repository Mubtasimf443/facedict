/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from './env';

export const mailer = nodemailer.createTransport({
    host : 'smtp-relay.brevo.com',
    port:587,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        ciphers:'SSLv3'
    },
    connectionTimeout: 10000, 
    dnsTimeout : 3000,
    socketTimeout : 3000,
    greetingTimeout : 3000
    
})