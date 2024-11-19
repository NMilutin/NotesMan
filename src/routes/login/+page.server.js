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
}
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		if (!email || !password) return;
		const user = await db.login(email, password);
		const session = await db.newSession(user[0].id);
		cookies.set('sessionid', session.id, { path: '/' });
		cookies.set('sessionkey', session.key, { path: '/' });
	}
};
