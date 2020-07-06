import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

export const transporter: Mail = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: Number(process.env.MAILER_PORT),
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});
