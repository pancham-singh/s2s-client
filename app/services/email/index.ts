import { createTransport } from 'nodemailer';
import { mail } from '../../config';

const transport = createTransport(mail.smtp);

export const sendMail: typeof transport.sendMail = transport.sendMail.bind(transport);
