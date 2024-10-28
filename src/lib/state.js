import { writable } from 'svelte/store';
import { Color } from '$lib/class/Color.js';
import { Note } from '$lib/class/Note.js';
import { Task } from '$lib/class/Task.js';
import { Goal } from '$lib/class/Goal.js';
import { browser } from '$app/environment';
export const datastore = writable({
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
	taskDate: new Date().toISOString().slice(0, 10),
	activeObject: {},
	types: [
		{ name: 'All', active: true },
		{ name: 'Notes', active: false },
		{ name: 'Tasks', active: false },
		{ name: 'Goals', active: false }
	],
	overlayOn: false,
	noteCreateMenuOn: false,
	taskCreateMenuOn: false,
	goalCreateMenuOn: false,
	noteMenuOn: false,
	editModeOn: false,
	taskDatePickerOn: false,
	goalEditMenuOn: false
});
let data;
datastore.subscribe((value) => {
	data = value;
});
export const clearInput = function () {
	datastore.update((data) => {
		data.input.name = '';
		data.input.date = new Date().toISOString().slice(0, 10);
		data.input.text = '';
		data.input.tasks = [];
		return data;
	});
};

export const addNote = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	datastore.update((data) => {
		data.notes.push(new Note(data.input.name, data.input.text, new Date(data.input.date)));
		return data;
	});
	clearInput();
	return true;
};
export const delNote = function (note) {
	datastore.update((data) => {
		const i = data.notes.findIndex((n) => {
			return n === note;
		});
		data.notes.splice(i, 1);
		return data;
	});

	clearInput();
	return true;
};

export const addTask = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	datastore.update((data) => {
		data.tasks.push(new Task(data.input.name, data.input.text, new Date(data.input.date)));
		return data;
	});

	clearInput();
	return true;
};
export const delTask = function (i) {
	datastore.update((data) => {
		data.tasks.splice(i, 1);
		data.activeObject = data.tasks.at(i);
		data.goals.forEach((goal) => {
			goal.tasks = goal.tasks.filter((task) => data.tasks.includes(task));
		});
		return data;
	});
};
export const doTask = function (i) {
	datastore.update((data) => {
		data.tasks.at(i).done = !data.tasks.at(i).done;
		return data;
	});
};
export const changeTaskDay = function (input) {
	datastore.update((data) => {
		data.taskDate = input;
		return data;
	});
};

export const addGoal = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	datastore.update((data) => {
		data.goals.push(
			new Goal(
				data.input.name,
				data.input.text,
				new Date(data.input.date),
				new Color('#DFDFCF'),
				...data.input.tasks
			)
		);
		return data;
	});

	clearInput();
	return true;
};
export const addInputGoalTask = function (task) {
	datastore.update((data) => {
		data.input.tasks.push(task);
		return data;
	});
};
export const removeInputGoalTask = function (i) {
	datastore.update((data) => {
		data.input.tasks.splice(i, 1);
		return data;
	});
};
export const hideOverlay = function () {
	datastore.update((data) => {
		data.overlayOn = false;
		data.noteCreateMenuOn = false;
		data.taskCreateMenuOn = false;
		data.goalCreateMenuOn = false;
		data.editModeOn = false;
		data.noteMenuOn = false;
		data.goalEditMenuOn = false;
		return data;
	});
	toggleScroll();
};
export const showCreateMenu = function () {
	datastore.update((data) => {
		const activeType = data.types.find((type) => type.active).name;
		if (activeType === 'All') return;
		if (activeType !== 'Tasks') data.input.date = new Date().toISOString().slice(0, 10);
		data.overlayOn = true;
		data.noteCreateMenuOn = activeType === 'Notes';
		data.taskCreateMenuOn = activeType === 'Tasks';
		data.goalCreateMenuOn = activeType === 'Goals';
		return data;
	});
	toggleScroll();
};
export const toggleScroll = function () {
	if (browser) {
		document.body.classList.toggle('noscroll');
	}
};
export const changeType = function (e) {
	datastore.update((data) => {
		data.types.forEach((type) => (type.active = type.name === e.target.dataset.type));
		data.types = data.types;
		if (data.types.find((type) => type.active).name === 'Tasks')
			data.input.date = new Date(data.taskDate).toISOString().slice(0, 10);
		return data;
	});
};

export const showNote = function (note) {
	datastore.update((data) => {
		data.overlayOn = true;
		data.activeObject = note;
		data.noteMenuOn = true;
		return data;
	});
	toggleScroll();
};
export const toggleTaskDatePicker = function (e) {
	datastore.update((data) => {
		if (e.target !== this) return;
		data.taskDatePickerOn = !data.taskDatePickerOn;
		return data;
	});
};
export const toggleNoteEdit = function () {
	datastore.update((data) => {
		data.editModeOn = !data.editModeOn;
		data.input.name = data.activeObject.name;
		data.input.text = data.activeObject.text;
		data.input.date = `${data.activeObject.date.getFullYear()}-${(data.activeObject.date.getMonth() + 1).toString().padStart(2, '0')}-${data.activeObject.date.getDate().toString().padStart(2, '0')}`;
		return data;
	});
};
export const confirmNoteEdit = function () {
	datastore.update((data) => {
		const note = data.notes.find((n) => n === data.activeObject);
		note.name = data.input.name;
		note.text = data.input.text;
		note.date = new Date(data.input.date);
		data.editModeOn = false;
		data.noteMenuOn = false;
		data.overlayOn = false;
		return data;
	});
	clearInput();
};
export const showGoalEditMenu = function (goal) {
	datastore.update((data) => {
		data.overlayOn = true;
		data.activeObject = goal;
		data.goalEditMenuOn = true;
		return data;
	});
	toggleScroll();
};
