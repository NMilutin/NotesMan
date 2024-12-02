import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
const isSessionValid = async function (cookies) {
	const [sessionId, sessionKey] = [cookies.get('sessionid'), cookies.get('sessionkey')];
	if (!sessionId || !sessionKey) return false;
	const valid = await db.isSessionValid(sessionId, sessionKey);
	return {
		sessionId: sessionId,
		valid: valid
	};
};
export async function load({ cookies }) {
	const { valid } = await isSessionValid(cookies);
	if (valid) {
		redirect(302, '/app');
	}
	const code = cookies.get('errorCode');
	const message = cookies.get('errorMessage');
	cookies.delete('errorCode', { path: '/login' });
	cookies.delete('errorMessage', { path: '/login' });
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
		if (!email || !password) return;
		const user = await db.login(email, password);
		if (typeof user !== 'string' && user.code) {
			cookies.set('errorCode', user.code, { path: '/login' });
			cookies.set('errorMessage', user.message, { path: '/login' });
			return;
		}
		const session = await db.newSession(user);
		cookies.set('sessionid', session.id, { path: '/' });
		cookies.set('sessionkey', session.key, { path: '/' });
	}
};
