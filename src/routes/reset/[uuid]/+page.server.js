import * as db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
	const code = cookies.get('errorCode');
	const message = cookies.get('errorMessage');
	const email = cookies.get('passResetEmail');
	cookies.delete('errorCode', { path: '/reset' });
	cookies.delete('errorMessage', { path: '/reset' });
	return {
		code,
		message,
		email
	};
}
export const actions = {
	reset: async ({ request, cookies, params }) => {
		const data = await request.formData();
		const newPassword = data.get('newPassword');
		const repeatPassword = data.get('repeatPassword');
		if (newPassword !== repeatPassword) {
			cookies.set('errorCode', 'DIFF_PASS', { path: '/reset' });
			cookies.set('errorMessage', 'Passwords do not match.', { path: '/reset' });
			return;
		}
		const uuid = params.uuid;
		const result = await db.resetPassword(uuid, newPassword);
		if (!result?.succes) {
			cookies.set('errorCode', result.code, { path: '/reset' });
			cookies.set('errorMessage', result.message, { path: '/reset' });
			return;
		}
		cookies.delete('passResetEmail', { path: '/reset' });
		redirect(302, '/login');
	}
};
