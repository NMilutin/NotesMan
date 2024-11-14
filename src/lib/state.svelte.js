import { Note } from '$lib/class/Note.svelte.js';
import { Task } from '$lib/class/Task.svelte.js';
import { Goal } from '$lib/class/Goal.svelte.js';
import { browser } from '$app/environment';
export const data = $state({
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
export const clearInput = function () {
	data.input.name = '';
	data.input.date = new Date().toISOString().slice(0, 10);
	data.input.text = '';
	data.input.tasks = [];
};

export const addNote = function (noteId) {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	data.notes.push(
		new Note(
			noteId,
			data.input.name,
			data.input.text,
			new Date(data.input.date),
			data.input.backgroundColor,
			data.input.textColor
		)
	);
	clearInput();
	return true;
};
export const delNote = function (note) {
	const i = data.notes.findIndex((n) => {
		return n === note;
	});
	data.notes.splice(i, 1);

	clearInput();
	hideOverlay();
	return true;
};

export const addTask = function (taskId) {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	data.tasks.push(
		new Task(
			taskId,
			data.input.name,
			data.input.text,
			new Date(data.input.date),
			data.input.backgroundColor,
			data.input.textColor
		)
	);

	clearInput();
	return true;
};
export const delTask = function (i) {
	data.tasks.splice(i, 1);
	data.activeObject = data.tasks.at(i);
	data.goals.forEach((goal) => {
		goal.tasks = goal.tasks.filter((task) => data.tasks.includes(task));
	});
};
export const doTask = function (i) {
	data.tasks.at(i).done = !data.tasks.at(i).done;
};
export const changeTaskDay = function (input) {
	data.taskDate = input;
};
export const onTaskDayChange = function () {
	data.input.date = data.taskDate;
};
export const addGoal = function (goalId) {
	if (!data.input.name || !data.input.text || !data.input.date) return false;
	data.goals.push(
		new Goal(
			goalId,
			data.input.name,
			data.input.text,
			new Date(data.input.date),
			data.input.backgroundColor,
			data.input.textColor,
			...data.input.tasks
		)
	);

	clearInput();
	return true;
};
export const delGoal = function (goal) {
	const i = data.goals.findIndex((g) => {
		return g === goal;
	});
	data.goals.splice(i, 1);

	clearInput();
	hideOverlay();
	return true;
};
export const addInputGoalTask = function (task) {
	data.input.tasks.push(task);
};
export const removeInputGoalTask = function (i) {
	data.input.tasks.splice(i, 1);
};
export const hideOverlay = function () {
	data.overlayOn = false;
	data.noteCreateMenuOn = false;
	data.taskCreateMenuOn = false;
	data.goalCreateMenuOn = false;
	data.editModeOn = false;
	data.noteMenuOn = false;
	data.goalEditMenuOn = false;
	toggleScroll();
};
export const showCreateMenu = function () {
	const activeType = data.types.find((type) => type.active).name;
	if (activeType === 'All') return;
	if (activeType !== 'Tasks') data.input.date = new Date().toISOString().slice(0, 10);
	data.overlayOn = true;
	data.noteCreateMenuOn = activeType === 'Notes';
	data.taskCreateMenuOn = activeType === 'Tasks';
	data.goalCreateMenuOn = activeType === 'Goals';
	toggleScroll();
};
export const toggleScroll = function () {
	if (browser) {
		document.body.classList.toggle('noscroll');
	}
};
export const changeType = function (e) {
	data.types.forEach((type) => (type.active = type.name === e.target.dataset.type));
	data.types = data.types;
	if (data.types.find((type) => type.active).name === 'Tasks')
		data.input.date = new Date(data.taskDate).toISOString().slice(0, 10);
};

export const showNote = function (note) {
	data.overlayOn = true;
	data.activeObject = note;
	data.noteMenuOn = true;
	toggleScroll();
};
export const toggleTaskDatePicker = function (e) {
	if (e.target !== this) return data;
	data.taskDatePickerOn = !data.taskDatePickerOn;
};
export const toggleNoteEdit = function () {
	data.editModeOn = !data.editModeOn;
	data.input.name = data.activeObject.name;
	data.input.text = data.activeObject.text;
	data.input.date = `${data.activeObject.date.getFullYear()}-${(data.activeObject.date.getMonth() + 1).toString().padStart(2, '0')}-${data.activeObject.date.getDate().toString().padStart(2, '0')}`;
	data.input.backgroundColor = data.activeObject.backgroundColor;
	data.input.textColor = data.activeObject.textColor;
};
export const confirmNoteEdit = function () {
	const note = data.notes.find((n) => n === data.activeObject);
	note.name = data.input.name;
	note.text = data.input.text;
	note.date = new Date(data.input.date);
	note.backgroundColor = data.input.backgroundColor;
	note.textColor = data.input.textColor;
	data.editModeOn = false;
	data.noteMenuOn = false;
	data.overlayOn = false;
	clearInput();
};
export const showGoalEditMenu = function (goal) {
	data.overlayOn = true;
	data.activeObject = goal;
	data.goalEditMenuOn = true;
	data.input.name = goal.name;
	data.input.text = goal.text;
	data.input.date = goal.date.toISOString().slice(0, 10);
	data.input.tasks = [...goal.tasks];
	data.input.backgroundColor = goal.backgroundColor;
	data.input.textColor = goal.textColor;
	toggleScroll();
};
export const confirmGoalEdit = function () {
	const goal = data.goals.find((g) => g === data.activeObject);
	goal.name = data.input.name;
	goal.text = data.input.text;
	goal.date = new Date(data.input.date);
	goal.tasks = [...data.input.tasks];
	goal.backgroundColor = data.input.backgroundColor;
	goal.textColor = data.input.textColor;
	data.goalEditMenuOn = false;
	data.overlayOn = false;
	clearInput();
	hideOverlay();
};
