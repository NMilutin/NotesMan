import * as db from '$lib/db.js';

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
	if (!valid)
		return {
			loggedIn: false
		};
	return await db.loadState(sessionId);
};

export const actions = {
	none: async () => {},
	create_note: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const note = {
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor')
		};
		const noteId = await db.insert.note(
			sessionId,
			note.name,
			note.text,
			note.date,
			note.backgroundColor,
			note.textColor
		);
		return {
			succes: true,
			noteId: noteId
		};
	},
	create_task: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const task = {
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor')
		};
		const taskId = await db.insert.task(
			sessionId,
			task.name,
			task.text,
			task.date,
			task.backgroundColor,
			task.textColor
		);
		return {
			succes: true,
			taskId: taskId
		};
	},
	create_goal: async ({ cookies, request }) => {
		const { sessionId, valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const goal = {
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor'),
			taskIds: JSON.parse(data.get('taskIds'))
		};
		const goalId = await db.insert.goal(
			sessionId,
			goal.name,
			goal.text,
			goal.date,
			goal.backgroundColor,
			goal.textColor,
			...goal.taskIds
		);
		return {
			succes: true,
			goalId: goalId
		};
	}
};
