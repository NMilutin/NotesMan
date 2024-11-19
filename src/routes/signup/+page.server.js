import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const repeatPassword = data.get('repeatPassword');
		if (password !== repeatPassword) return;
		const id = await db.register(email, password);
		const session = await db.newSession(id);
		cookies.set('sessionid', session.id, { path: '/' });
		cookies.set('sessionkey', session.key, { path: '/' });
		redirect(302, '/app');
	}
};
