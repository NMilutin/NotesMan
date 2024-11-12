import * as db from '$lib/db.js';
export async function load({ cookies }) {
	const id = JSON.parse(cookies.get('sessionid') || '""');
	return {
		sessionId: id
	};
}
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		if (!email || !password) return;
		const user = await db.login(email, password);
		const session = await db.newSession(user[0].id);
		cookies.set('sessionid', JSON.stringify(session.id), { path: '/' });
		cookies.set('sessionkey', JSON.stringify(session.key), { path: '/' });
	}
};
