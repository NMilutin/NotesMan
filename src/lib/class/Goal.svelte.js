import { Color } from './Color.svelte.js';
import { Note } from './Note.svelte.js';
import { Task } from './Task.svelte.js';
export class Goal extends Note {
	#tasks = $state([]);
	addTask(task) {
		if (!(task instanceof Task)) throw new Error('Value is not a Task object');
		this.#tasks.push(task);
	}
	removeTask(task) {
		const i = this.#tasks.find((t) => t === task);
		return this.#tasks.splice(i, 1);
	}
	getTask(i) {
		return this.#tasks.at(i);
	}
	findTask(task) {
		return this.#tasks.find((t) => t === task);
	}
	get tasks() {
		return this.#tasks;
	}
	set tasks(value) {
		if (!(value instanceof Array)) throw new Error('Value is not an Array');
		value.forEach((task) => {
			if (!(task instanceof Task)) throw new Error('Array has a value that is not a Task object');
		});
		this.#tasks = [...value];
	}
	#done = $state(false);
	get achieved() {
		return this.#done;
	}
	set achieved(value) {
		if (typeof value !== 'boolean') throw new Error('Value is not a boolean');
		this.#done = value;
	}
	constructor(id, name, text, date, backgroundColor, textColor, ...tasks) {
		try {
			super(id, name, text, date, backgroundColor, textColor);
			this.tasks = tasks;
		} catch (e) {
			throw e;
		}
	}
	toJSON() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			text: this.text,
			date: this.date.toISOString(),
			backgroundColor: this.backgroundColor,
			textColor: this.textColor,
			tasks: this.tasks.map((task) => task.toJSON())
		});
	}
}
