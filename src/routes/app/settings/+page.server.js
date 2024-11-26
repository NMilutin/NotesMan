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
	back: async () => {
		redirect(302, '/app');
	}
};
