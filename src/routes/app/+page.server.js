import * as db from '$lib/db.js';

export const ssr = false;

export async function load({ cookies }) {
	const [sessionId, sessionKey] = [cookies.get('sessionid'), cookies.get('sessionkey')];
	if ((!sessionId, !sessionKey)) {
		return {
			loggedIn: false
		};
	}
	const valid = await db.isSessionValid(sessionId, sessionKey);
	if (valid)
		return {
			loggedIn: false
		};
	return await db.loadState(sessionId);
}
