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
	const code = cookies.get('errorCode');
	const message = cookies.get('errorMessage');
	cookies.delete('errorCode', { path: '/app/settings' });
	cookies.delete('errorMessage', { path: '/app/settings' });
	const data = await db.loadState(sessionId);
	data.code = code;
	data.message = message;
	return data;
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
		await db.updateEmail(sessionId, newEmail);
		cookies.set('email', newEmail, { path: '/confirm' });
		redirect(302, '/confirm');
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
		const msg = await db.updatePassword(sessionId, oldPassword, newPassword);
		if (msg?.code) {
			cookies.set('errorCode', msg.code, { path: '/app/settings' });
			cookies.set('errorMessage', msg.message, { path: '/app/settings' });
			return;
		}
	},
	delete_account: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		db.deleteAccount(sessionId);
		redirect(307, '/');
	},
	upload: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const file = data.get('upload');
		const json = await file.text();
		const parsedData = JSON.parse(json);
		const result = await db.restoreData(sessionId, parsedData);
		if (result.succes) return;
	}
};
