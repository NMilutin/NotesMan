import nodemailer from 'nodemailer';
import * as env from '$env/static/private';

export default nodemailer.createTransport({
	host: env.MAIL_HOST,
	port: env.MAIL_PORT,
	secure: env.MAIL_SECURE, // true for port 465, false for other ports
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASSWORD
	}
});
