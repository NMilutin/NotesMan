import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const repeatPassword = data.get('repeatPassword');
		if (password !== repeatPassword) return;
		await db.register(email, password);
		const sessionid = cookies.get('sessionid');
		if (sessionid) await db.logout(sessionid);
		cookies.set('email', email, { path: '/activate' });
		redirect(302, '/activate');
	}
};
