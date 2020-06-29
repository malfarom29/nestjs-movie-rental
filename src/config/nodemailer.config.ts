import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import * as config from 'config';

const emailConfig = config.get('mailer');

export const transporter: Mail = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || emailConfig.host,
  port: process.env.EMAIL_PORT || emailConfig.port,
  auth: {
    user: process.env.EMAIL_USER || emailConfig.auth.user,
    pass: process.env.EMAIL_PASSWORD || emailConfig.auth.password,
  },
});
