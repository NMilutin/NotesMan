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
	},
	delete_note: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const noteId = data.get('noteIdDelete');
		db.remove.note(noteId);
	},
	delete_goal: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const goalId = data.get('goalIdDelete');
		db.remove.goal(goalId);
	},
	update_note: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const note = {
			id: data.get('noteIdUpdate'),
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor')
		};
		await db.update.note(
			note.id,
			note.name,
			note.text,
			note.date,
			note.backgroundColor,
			note.textColor
		);
	},
	update_goal: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const goal = {
			id: data.get('goalIdUpdate'),
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor'),
			taskIds: JSON.parse(data.get('taskIds'))
		};
		db.update.goal(
			goal.id,
			goal.name,
			goal.text,
			goal.date,
			goal.backgroundColor,
			goal.textColor,
			...goal.taskIds
		);
	},
	delete_task: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const id = data.get('deleteTaskId');
		db.remove.task(id);
	},
	do_task: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const id = data.get('doTaskId');
		const done = data.get('done');
		db.update.doTask(id, done);
	},
	update_task: async ({ cookies, request }) => {
		const { valid } = await isSessionValid(cookies);
		if (!valid)
			return {
				succes: false
			};
		const data = await request.formData();
		const task = {
			id: data.get('taskIdUpdate'),
			name: data.get('name'),
			text: data.get('text'),
			date: data.get('date'),
			backgroundColor: data.get('backgroundColor'),
			textColor: data.get('textColor')
		};
		db.update.task(task.id, task.name, task.text, task.date, task.backgroundColor, task.textColor);
	}
};
