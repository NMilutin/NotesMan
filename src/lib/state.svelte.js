import { writable } from 'svelte/store';
import { Note } from '$lib/class/Note.js';
import { Task } from '$lib/class/Task.js';
import { Goal } from '$lib/class/Goal.js';
import { browser } from '$app/environment';
export const datastore = writable({
	notes: [],
	tasks: [],
	goals: [],
	input: {
		name: '',
		date: new Date().toISOString().slice(0, 10),
		text: '',
		tasks: [],
		backgroundColor: '#DFDFCF',
		textColor: '#000000'
	},
	taskDate: new Date().toISOString().slice(0, 10),
	activeObject: {},
	types: [
		{ name: 'Notes', active: true },
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
let data = $state();
export let getData = () => data;
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
		data.notes.push(
			new Note(
				data.input.name,
				data.input.text,
				new Date(data.input.date),
				data.input.backgroundColor,
				data.input.textColor
			)
		);
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
	hideOverlay();
	return true;
};

export const addTask = function () {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	datastore.update((data) => {
		data.tasks.push(
			new Task(
				data.input.name,
				data.input.text,
				new Date(data.input.date),
				data.input.backgroundColor,
				data.input.textColor
			)
		);
		return data;
	});

	clearInput();
	return true;
};
export const delTask = function (i) {
	debugger;
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
	debugger;
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
export const onTaskDayChange = function () {
	datastore.update((data) => {
		data.input.date = data.taskDate;
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
				data.input.backgroundColor,
				data.input.textColor,
				...data.input.tasks
			)
		);
		return data;
	});

	clearInput();
	return true;
};
export const delGoal = function (goal) {
	datastore.update((data) => {
		const i = data.goals.findIndex((g) => {
			return g === goal;
		});
		data.goals.splice(i, 1);
		return data;
	});

	clearInput();
	hideOverlay();
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
		if (e.target !== this) return data;
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
		data.input.backgroundColor = data.activeObject.backgroundColor;
		data.input.textColor = data.activeObject.textColor;
		return data;
	});
};
export const confirmNoteEdit = function () {
	datastore.update((data) => {
		const note = data.notes.find((n) => n === data.activeObject);
		note.name = data.input.name;
		note.text = data.input.text;
		note.date = new Date(data.input.date);
		note.backgroundColor = data.input.backgroundColor;
		note.textColor = data.input.textColor;
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
		data.input.name = goal.name;
		data.input.text = goal.text;
		data.input.date = goal.date.toISOString().slice(0, 10);
		data.input.tasks = [...goal.tasks];
		data.input.backgroundColor = goal.backgroundColor;
		data.input.textColor = goal.textColor;
		return data;
	});
	toggleScroll();
};
export const confirmGoalEdit = function () {
	datastore.update((data) => {
		const goal = data.goals.find((g) => g === data.activeObject);
		goal.name = data.input.name;
		goal.text = data.input.text;
		goal.date = new Date(data.input.date);
		goal.tasks = [...data.input.tasks];
		goal.backgroundColor = data.input.backgroundColor;
		goal.textColor = data.input.textColor;
		data.goalEditMenuOn = false;
		data.overlayOn = false;
		return data;
	});
	clearInput();
	hideOverlay();
};