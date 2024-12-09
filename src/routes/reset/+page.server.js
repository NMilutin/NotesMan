import * as db from '$lib/db.js';
export async function load() {
	return {};
}
export const actions = {
	send: async ({ request, cookies }) => {
		const data = request.formData();
		const email = data.get('email');
		cookies.set('passResetEmail', email, { path: '/reset' });
	}
};
