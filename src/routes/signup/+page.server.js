import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const code = cookies.get('errorCode');
	const message = cookies.get('errorMessage');
	cookies.delete('errorCode', { path: '/signup' });
	cookies.delete('errorMessage', { path: '/signup' });
	return {
		code,
		message
	};
}
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const repeatPassword = data.get('repeatPassword');
		if (password !== repeatPassword) return;
		const msg = await db.register(email, password);
		if (msg.code !== 'OK') {
			cookies.set('errorCode', msg.code, { path: '/signup' });
			cookies.set('errorMessage', msg.message, { path: '/signup' });
			return;
		}
		const sessionid = cookies.get('sessionid');
		if (sessionid) await db.logout(sessionid);
		cookies.set('email', email, { path: '/activate' });
		redirect(302, '/activate');
	}
};
