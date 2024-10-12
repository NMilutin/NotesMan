import { writable } from 'svelte/store';
import { Color } from '$lib/class/Color.js';
import { Note } from '$lib/class/Note.js';
import { Task } from '$lib/class/Task.js';
import { Goal } from '$lib/class/Goal.js';

export const data = writable({
	notes: [],
	tasks: [
		new Task('1', '2', new Date(), new Color('#c4f')),
		new Task('2', '2', new Date(), new Color('#c4f')),
		new Task('3', '2', new Date(), new Color('#c4f')),
		new Task('4', '2', new Date(), new Color('#c4f')),
		new Task('5', '2', new Date(), new Color('#c4f')),
		new Task('6', '2', new Date(), new Color('#c4f'))
	],
	goals: [],
	input: {
		name: '',
		date: new Date().toISOString().slice(0, 10),
		text: '',
		tasks: []
	},
	taskDate: ''
});
const clearInput = function () {
	data.update((data) => {
		data.input.name = '';
		data.input.date = new Date().toISOString().slice(0, 10);
		data.input.text = '';
		data.input.tasks = [];
		return data;
	});
};

export const addNote = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return;
	data.update((data) => {
		data.notes.push(new Note(data.input.name, data.input.text, new Date(data.input.date)));
		return data;
	});
	clearInput();
};
export const delNote = function (note) {
	data.update((data) => {
		const i = data.notes.findIndex((n) => {
			return n === note;
		});
		data.notes.splice(i, 1);
	});

	clearInput();
};

export const addTask = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return;
	data.update((data) => {
		data.tasks.push(new Task(data.input.name, data.input.text, new Date(data.input.date)));
	});

	clearInput();
};
export const delTask = function (i) {
	data.update((data) => {
		data.tasks.splice(i, 1);
		activeTask = data.tasks.at(i);
	});
};
export const changeTaskDay = function (input) {
	data.update((data) => {
		data.taskDate = input;
		return data;
	});
};

export const addGoal = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return;
	data.goals.push(
		new Goal(data.input.name, data.input.text, new Date(data.input.date), ...input.goalTasks)
	);

	clearInput();
};
