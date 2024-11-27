import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
export const ssr = false;

const isSessionValid = async function (cookies) {
	const [sessionId, sessionKey] = [cookies.get('sessionid'), cookies.get('sessionkey')];
	if (!sessionId || !sessionKey) return false;
	const valid = await db.isSessionValid(sessionId, sessionKey);
	return {
		sessionId: sessionId,
		valid: valid
	};
};

export const load = async function ({ cookies }) {
	const { sessionId, valid } = await isSessionValid(cookies);
	if (!valid) redirect(307, '/login');
	return await db.loadState(sessionId);
};

export const actions = {
	none: async () => {
		return;
	},
	logout: async ({ cookies }) => {
		const sessionId = cookies.get('sessionid');
		db.logout(sessionId);
		cookies.delete('sessionid', { path: '/' });
		cookies.delete('sessionkey', { path: '/' });
		redirect(307, '/login');
	},
	back: async () => {
		redirect(302, '/app');
	},
	new_email: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const newEmail = data.get('newEmail');
		db.updateEmail(sessionId, newEmail);
	},
	new_password: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const oldPassword = data.get('oldPassword');
		const newPassword = data.get('newPassword');
		db.updatePassword(sessionId, oldPassword, newPassword);
	},
	backup_data: async ({ request }) => {}
};
