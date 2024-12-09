import { Note } from '$lib/class/Note.svelte.js';
import { Task } from '$lib/class/Task.svelte.js';
import { Goal } from '$lib/class/Goal.svelte.js';

import { formatISO9075 } from 'date-fns';
import sql from './postgresClient';
import mail from './mailClient';
import { randomInt } from 'node:crypto';

const sendActivation = async function (id) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let otp = '';
	for (let i = 0; i < 8; i++) otp += chars.at(randomInt(0, 35));
	const d = new Date();
	await sql`
    delete from activations where user_id = ${id};
  `;
	await sql`
    insert into activations(code_hash,user_id,created,expires) values
    (
      crypt(${otp},gen_salt('bf')),
      ${id},
      ${formatISO9075(d)},
      ${formatISO9075(new Date(d.getTime() + 1000 * 10 * 60))}
    )
  `;
	const [{ email: accountEmail }] = await sql`select email from users where id=${id}`;
	const sentEmail = await mail.sendMail({
		from: 'NotesMan <notesman@zohomail.eu>',
		to: accountEmail,
		subject: 'NotesMan account activation',
		text: `The code for activating your NotesMan account is ${otp} and it will expire after 10 minutes. If you didn't request a NotesMan account you can safely ignore this email.`,
		html: `
      <body>
        <h1>NotesMan</h1>
        <hr/>
        <p>The code for activating your NotesMan account is</p>
        <h2><strong>${otp}</strong></h2>
        <p>And it will expire after 10 minutes</p>
        <hr/>
        <p>If you didn't request a NotesMan account you can safely ignore this email.</p> 
      <style>
      body {font-family: sans-serif;}
      h2 {text-align: center;}
      </style>
    `
	});
};
const sendNewEmailActivation = async function (id) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let otp = '';
	for (let i = 0; i < 8; i++) otp += chars.at(randomInt(0, 35));
	const d = new Date();
	await sql`
    delete from activations where user_id = ${id};
  `;
	await sql`
    insert into activations(code_hash,user_id,created,expires) values
    (
      crypt(${otp},gen_salt('bf')),
      ${id},
      ${formatISO9075(d)},
      ${formatISO9075(new Date(d.getTime() + 1000 * 10 * 60))}
    )
  `;
	const [{ new_email: accountEmail }] = await sql`select new_email from users where id=${id}`;
	const sentEmail = await mail.sendMail({
		from: 'NotesMan <notesman@zohomail.eu>',
		to: accountEmail,
		subject: 'NotesMan account activation',
		text: `The code for changing your NotesMan account email is ${otp} and it will expire after 10 minutes. If you didn't request a NotesMan account email change you can safely ignore this email.`,
		html: `
      <body>
        <h1>NotesMan</h1>
        <hr/>
        <p>The code for changing your NotesMan account email is</p>
        <h2><strong>${otp}</strong></h2>
        <p>And it will expire after 10 minutes</p>
        <hr/>
        <p>If you didn't request a NotesMan account email change you can safely ignore this email.</p> 
      <style>
      body {font-family: sans-serif;}
      h2 {text-align: center;}
      </style>
    `
	});
};

export const register = async function (email, password) {
	const [{ email_exists: emailExists }] =
		await sql`select count(id)>0 email_exists from users where email=${email};`;
	if (emailExists)
		return { code: 'EMAIL_EXISTS', message: 'The email you entered is already registered.' };
	if (password.length < 8)
		return { code: 'SHORT_PAS', message: 'Password must be at least 8 characters long.' };
	if (password.length > 72)
		return { code: 'LONG_PAS', message: "Password can't be longer than 72 characters." };
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])/;
	if (!regex.test(password))
		return {
			code: 'BAD_PAS',
			message:
				'Password must include at least one lowercase and uppercase letter, number and a special character.'
		};
	const [{ id }] = await sql`
    insert into users(email,password_hash) values
    (${email},crypt(${password},gen_salt('bf')))
    returning id;
  `;
	await sendActivation(id);
	return { code: 'OK', message: '' };
};

export const activate = async function (email, otp) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	if (otp.length !== 8) return { code: 'BAD_LEN', message: 'The code should be 8 characters long' };
	let valid = true;
	otp.split('').forEach((char) => {
		if (!chars.includes(char)) valid = false;
	});
	if (!valid) return { code: 'BAD_CHAR', message: 'The code has non alphanumeric characters' };
	const [{ id }] = await sql`select id from users where email=${email}`;
	const [{ code_exists: codeExists }] =
		await sql`select count(id)>0 code_exists from activations where user_id=${id}`;
	const [{ activated: isActivated }] = await sql`select activated from users where id=${id}`;
	if (!codeExists) {
		if (!isActivated) {
			sendActivation(id);
			return {
				code: 'NO_CODE',
				message: 'The code you entered is expired or wrong. You will recieve a new code shortly.'
			};
		}
		return { code: 'ACTIVATED', message: 'Your account is already activated.' };
	}
	const [{ is_correct: isCorrect, expired }] = await sql`
    select code_hash=crypt(${otp},code_hash) as is_correct, extract(second from (now()-expires)) > 0 as expired
    from activations where user_id=${id}
  `;
	if (!isCorrect) return { code: 'WRONG_CODE', message: 'Incorrect code,' };
	if (expired) {
		await sql`delete from activations where user_id=${id}`;
		sendActivation(id);
		return {
			code: 'EXP_CODE',
			message: 'The code you entered is expired. You will recieve a new code shortly.'
		};
	}
	await sql`update users set activated=true where id=${id}`;
	await sql`delete from activations where user_id=${id}`;
	return id;
};
export const activateNewEmail = async function (email, otp) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	if (otp.length !== 8) return { code: 'BAD_LEN', message: 'The code should be 8 characters long' };
	let valid = true;
	otp.split('').forEach((char) => {
		if (!chars.includes(char)) valid = false;
	});
	if (!valid) return { code: 'BAD_CHAR', message: 'The code has non alphanumeric characters' };
	const [{ id }] = await sql`select id from users where new_email=${email}`;
	const [{ code_exists: codeExists }] =
		await sql`select count(id)>0 code_exists from activations where user_id=${id}`;
	const [{ activated: isActivated }] =
		await sql`select new_email_activated from users where id=${id}`;
	if (!codeExists) {
		return { code: 'ACTIVATED', message: 'Your new email is already activated.' };
	}
	const [{ is_correct: isCorrect, expired }] = await sql`
    select code_hash=crypt(${otp},code_hash) as is_correct, extract(second from (now()-expires)) > 0 as expired
    from activations where user_id=${id}
  `;
	if (!isCorrect) return { code: 'WRONG_CODE', message: 'Incorrect code,' };
	if (expired) {
		await sql`delete from activations where user_id=${id}`;
		sendNewEmailActivation(id);
		return {
			code: 'EXP_CODE',
			message: 'The code you entered is expired. You will recieve a new code shortly.'
		};
	}
	await sql`update users set new_email_activated=true, email=new_email, new_email=null where id=${id}`;
	await sql`delete from activations where user_id=${id}`;
	return id;
};

export const login = async function (email, password) {
	const res = await sql`
    select id
    from users
    where email=${email} 
  `;
	if (!res?.[0]?.id)
		return { code: 'NOT_EXIST', message: "Account with entered email doesn't exist." };
	const id = res[0].id;
	const [{ is_correct: isCorrect }] = await sql`
    select password_hash=crypt(${password},password_hash) as is_correct
    from users where id=${id};
  `;
	if (!isCorrect) return { code: 'WRONG_PAS', message: 'Wrong password.' };
	const [{ activated: isActivated }] = await sql`
    select activated
    from users where id=${id};
  `;
	if (!isActivated) {
		sendActivation(id);
		return {
			code: 'NOT_ACT',
			message: 'Account not activated. Redirecting you to the activation page.'
		};
	}
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
	)[0]?.val;
	if (!isKeyCorrect) return isKeyCorrect;
	const now = new Date();
	const expireSql = (await sql`select expires from sessions where id=${sessionId} limit 1`)[0]
		.expires;
	const expire = new Date(expireSql);
	const expired = expire - now < 0;
	if (!expired) await refreshSession(sessionId, key);
	else await sql`delete from sessions where id=${sessionId}`;
	return !expired;
};
export const logout = async function (sessionId) {
	await sql`
    delete from sessions where id=${sessionId}
  `;
};
export const updateEmail = async function (sessionId, newEmail) {
	const userId = (await sql`select user_id from sessions where id=${sessionId}`)[0].user_id;
	await sql`update users set new_email=${newEmail}, new_email_activated=false where id=${userId}`;
	await sendNewEmailActivation(userId);
};
export const updatePassword = async function (sessionId, oldPassword, newPassword) {
	if (newPassword.length < 8)
		return { code: 'SHORT_PAS', message: 'Password must be at least 8 characters long.' };
	if (newPassword.length > 72)
		return { code: 'LONG_PAS', message: "Password can't be longer than 72 characters." };
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])/;
	if (!regex.test(newPassword))
		return {
			code: 'BAD_PAS',
			message:
				'Password must include at least one lowercase and uppercase letter, number and a special character.'
		};
	const userId = (await sql`select user_id from sessions where id=${sessionId}`)[0].user_id;
	const isOldPasswordCorrect = (
		await sql`select password_hash=crypt(${oldPassword},password_hash) is_correct from users where id=${userId}`
	)[0].is_correct;
	if (isOldPasswordCorrect)
		await sql`update users set password_hash=crypt(${newPassword},gen_salt('bf'))`;
	else return { code: 'WRONG_PAS', message: 'Old password is not correct.' };
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
	async task(taskId, name, text, date, bgColor, textColor) {
		await sql`
      update tasks set name=${name},text=${text},date=${date},background_color=${bgColor},text_color=${textColor}
      where id=${taskId}; 
    `;
	},
	async doTask(taskId, done) {
		if (done === 'true')
			await sql`
      update tasks set done=TRUE
      where id=${taskId};
    `;
		if (done === 'false')
			await sql`
      update tasks set done=FALSE
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
	data.email = (await sql`select email from users where id=${userId}`)[0].email;
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
export const backupData = async function (sessionId) {
	const [{ user_id: id }] = await sql`
    select user_id
    from sessions
    where id = ${sessionId}
  `;
	const notes = Array.from(
		await sql`
    select name,text,date,background_color,text_color
    from notes
    where user_id = ${id}
  `
	);
	const tasks = Array.from(
		await sql`
    select id,name,text,date,background_color,text_color,done
    from tasks
    where user_id = ${id}
  `
	);
	const goals = Array.from(
		await sql`
    select id,name,text,date,background_color,text_color
    from goals
    where user_id = ${id}
  `
	);
	const task_goal = Array.from(
		await sql`
    select task_id,goal_id
    from task_goal join goals
    on goal_id = goals.id and user_id = ${id}
  `
	);
	return { notes, tasks, goals, task_goal };
};
export const deleteAccount = async function (sessionId) {
	const [{ user_id: id }] = await sql`
    select user_id
    from sessions
    where id = ${sessionId}
  `;
	await sql`
    delete
    from notes
    where user_id = ${id};
  `;
	await sql`
    delete
    from task_goal
    where task_id in (select id from tasks where user_id = ${id}) or goal_id in (select id from goals where user_id=${id});
  `;
	await sql`
    delete
    from tasks
    where user_id = ${id};
  `;
	await sql`
    delete
    from goals
    where user_id = ${id};
  `;
	await sql`
    delete
    from sessions
    where user_id = ${id};
  `;
	await sql`
    delete
    from users
    where id = ${id}
  `;
};
export const sendPasswordReset = async function (email) {
	const [{ email_exists: emailExists }] = await sql`
    select count(id)>0 email_exists from users where email=${email};
  `;
	if (!emailExists)
		return {
			code: 'NOT_REG',
			message: 'The email you entered is not registered.'
		};
	const [{ id: userId }] = await sql`select id from users where email=${email}`;
	const [{ key }] = await sql`
    select crypt(concat(email,now()),gen_salt('bf')) as key
    from users where id=${id}
  `;
	const [{ reset_link_uuid: resetLinkUUID }] = await sql`
    insert into password_resets(user_id,reset_key_hash) values
    (
      ${userId},
      crypt(${key},gen_salt('bf'))
    ) returning reset_link_uuid
  `;
	// return resetLinkUUID;
};
