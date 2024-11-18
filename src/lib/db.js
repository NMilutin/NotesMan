import { Note } from '$lib/class/Note.svelte.js';
import { Task } from '$lib/class/Task.svelte.js';
import { Goal } from '$lib/class/Goal.svelte.js';

import { formatISO9075 } from 'date-fns';
import sql from './postgresClient';
export const register = function (email, password) {
	try {
		if (password.length > 72) throw new Error('Password length shouldnt be more than 72');
		sql`
    insert into users(email,password_hash) values
    (${email},crypt(${password},gen_salt('bf')));
  `;
	} catch (e) {
		throw e;
	}
};

export const login = async function (email, password) {
	const id = await sql`
    select id
    from users
    where email=${email}
    and password_hash=crypt(${password},password_hash); 
  `;
	return id;
};
export const newSession = async function (id) {
	const d = new Date();
	const key = (
		await sql`
    select crypt(concat(email,now()),gen_salt('bf')) as key
    from users where id=${id}
  `
	)[0].key;
	return {
		id: (
			await sql`
    insert into sessions(user_id,created,expires,session_key_hash) values
    (
      ${id},
      ${formatISO9075(d)},
      ${formatISO9075(new Date(d.getTime() + 1000 * 3600 * 3))},
      crypt(${key},gen_salt('bf'))
    )
    returning id;
  `
		)[0].id,
		key: key
	};
};
const refreshSession = async function (sessionId) {
	const d = new Date();
	await sql`
    update sessions set expires=${formatISO9075(new Date(d.getTime() + 1000 * 3600 * 3))}
    where id=${sessionId}
  `;
};
export const isSessionValid = async function (sessionId, key) {
	const isKeyCorrect = (
		await sql`
    select session_key_hash=crypt(${key},session_key_hash) val
    from sessions where id=${sessionId};
  `
	)[0].val;
	if (!isKeyCorrect) return isKeyCorrect;
	const now = new Date();
	const expireSql = (await sql`select expires from sessions where id=${sessionId} limit 1`)[0]
		.expires;
	const expire = new Date(expireSql);
	const expired = expire - now < 0;
	if (!expired) refreshSession(sessionId, key);
	else await sql`delete from sessions where id=${sessionId}`;
	return !expired;
};

export const insert = {
	async note(sessionId, name, text, date, bgColor, textColor) {
		const userId = (await sql`select user_id from sessions where id=${sessionId} limit 1`)[0]
			.user_id;
		return (
			await sql`
      insert into notes (name,text,date,background_color,text_color,user_id) values
      (${name},${text},${date},${bgColor},${textColor},${userId}) returning id;
    `
		)[0].id;
	},
	async task(sessionId, name, text, date, bgColor, textColor) {
		const userId = (await sql`select user_id from sessions where id=${sessionId} limit 1`)[0]
			.user_id;
		return (
			await sql`
      insert into tasks (name,text,date,background_color,text_color,user_id) values
      (${name},${text},${date},${bgColor},${textColor},${userId}) returning id;
    `
		)[0].id;
	},
	async goal(sessionId, name, text, date, bgColor, textColor, ...taskIds) {
		const userId = (await sql`select user_id from sessions where id=${sessionId} limit 1`)[0]
			.user_id;
		const goalId = (
			await sql`
      insert into goals (name,text,date,background_color,text_color,user_id) values
      (${name},${text},${date},${bgColor},${textColor},${userId})
      returning id;
    `
		)[0].id;
		taskIds.forEach((taskId) => {
			sql`insert into task_goal (task_id,goal_id) values (${taskId},${goalId})`.execute();
		});
		return goalId;
	}
};
export const update = {
	async note(noteId, name, text, date, bgColor, textColor) {
		await sql`
      update notes set name=${name},text=${text},date=${date},background_color=${bgColor},text_color=${textColor}
      where id=${noteId}; 
    `;
	},
	async task(taskId, name, text, date, bgColor, textColor, done) {
		await sql`
      update tasks set name=${name},text=${text},date=${date},background_color=${bgColor},text_color=${textColor},done=${done}
      where id=${taskId}; 
    `;
	},
	async goal(goalId, name, text, date, bgColor, textColor, ...taskIds) {
		await sql`
      update goals set name=${name},text=${text},date=${date},background_color=${bgColor},text_color=${textColor}
      where id=${goalId};
    `;
		await sql`
      delete
      from task_goal
      where goal_id = ${goalId}
    `;
		taskIds.forEach((taskId) => {
			sql`insert into task_goal (task_id,goal_id) values (${taskId},${goalId})`.execute();
		});
	}
};
export const remove = {
	async note(noteId) {
		await sql`
      delete from notes
      where id=${noteId}
    `;
	},
	async task(taskId) {
		await sql`
      delete from task_goal
      where task_id=${taskId}
    `;
		await sql`
      delete from tasks
      where id=${taskId}
    `;
	},
	async goal(goalId) {
		await sql`
      delete from task_goal
      where goal_id=${goalId}
    `;
		await sql`
      delete from goals
      where id=${goalId}
    `;
	}
};
export const loadState = async function (sessionId) {
	const data = {
		notes: [],
		tasks: [],
		goals: []
	};
	const userId = (await sql`select user_id from sessions where id=${sessionId}`)[0].user_id;
	const notes = await sql`
    select * from notes where user_id = ${userId};
  `;
	const tasks = await sql`
    select * from tasks where user_id = ${userId};
  `;
	const goals = await sql`
    select * from goals where user_id = ${userId};
  `;
	const task_goal = await sql`
    select task_id,goal_id from task_goal join goals
    on goal_id = goals.id and user_id=${userId};
  `;
	data.notes = notes.map(
		({ id, name, text, date, background_color: backgroundColor, text_color: textColor }) => {
			return new Note(id, name, text, date, backgroundColor, textColor).toJSON();
		}
	);
	data.tasks = tasks.map(
		({ id, name, text, date, background_color: backgroundColor, text_color: textColor, done }) => {
			return new Task(id, name, text, date, backgroundColor, textColor, done).toJSON();
		}
	);
	data.goals = goals.map(
		({ id, name, text, date, background_color: backgroundColor, text_color: textColor }) => {
			const goalTasks = task_goal
				.filter((task) => task.goal_id === id)
				.map(({ task_id: id }) => tasks.find(({ id: taskId }) => taskId === id))
				.map(
					({
						id,
						name,
						text,
						date,
						background_color: backgroundColor,
						text_color: textColor,
						done
					}) => new Task(id, name, text, date, backgroundColor, textColor, done)
				);
			return new Goal(id, name, text, date, backgroundColor, textColor, ...goalTasks).toJSON();
		}
	);
	return data;
};
