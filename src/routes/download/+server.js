import * as db from '$lib/db.js';
import { json } from '@sveltejs/kit';

const isSessionValid = async function (cookies) {
	const [sessionId, sessionKey] = [cookies.get('sessionid'), cookies.get('sessionkey')];
	if (!sessionId || !sessionKey) return { sessionId: '', valid: false };
	const valid = await db.isSessionValid(sessionId, sessionKey);
	return {
		sessionId: sessionId,
		valid: valid
	};
};

export const GET = async function ({ cookies }) {
	const { sessionId, valid } = await isSessionValid(cookies);
	if (!valid) return json('Invalid Session');
	const data = await db.backupData(sessionId);
	return json(data);
};
