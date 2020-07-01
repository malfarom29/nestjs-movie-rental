import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import * as config from 'config';

const emailConfig = config.get('mailer');

export const transporter: Mail = nodemailer.createTransport({
  host: process.env.MAILER_HOST || emailConfig.host,
  port: process.env.MAILER_PORT || emailConfig.port,
  auth: {
    user: process.env.MAILER_USER || emailConfig.user,
    pass: process.env.MAILER_PASSWORD || emailConfig.password,
  },
});
