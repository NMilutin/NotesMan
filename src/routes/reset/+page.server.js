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
	const submitted = cookies.get('passResetEmail')?.length > 0;
	cookies.delete('errorCode', { path: '/reset' });
	cookies.delete('errorMessage', { path: '/reset' });
	return {
		code,
		message,
		submitted
	};
}
export const actions = {
	send: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const result = await db.sendPasswordReset(email, request.headers.get('host'));
		if (!result.succes) {
			cookies.set('errorCode', result.code, { path: '/reset' });
			cookies.set('errorMessage', result.message, { path: '/reset' });
			return;
		}
		cookies.set('passResetEmail', email, { path: '/reset' });
	}
};
