import * as db from '$lib/db.js';

import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
	const code = cookies.get('errorCode');
	const message = cookies.get('errorMessage');
	const email = cookies.get('email');
	if (!email || email.length === 0) redirect(302, '/');
	cookies.delete('errorCode', { path: '/activate' });
	cookies.delete('errorMessage', { path: '/activate' });
	return {
		code,
		message,
		email
	};
}

export const actions = {
	activate: async ({ request, cookies }) => {
		const data = await request.formData();
		const otp = data.get('code');
		const email = cookies.get('email');
		const user = await db.activate(email, otp);
		if (user.code) {
			cookies.set('errorCode', user.code, { path: '/activate' });
			cookies.set('errorMessage', user.message, { path: '/activate' });
			return;
		}
		cookies.delete('email', { path: '/activate' });
		const session = await db.newSession(user);
		cookies.set('sessionid', session.id, { path: '/' });
		cookies.set('sessionkey', session.key, { path: '/' });
		redirect(302, '/app');
	}
};
