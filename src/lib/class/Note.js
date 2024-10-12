import { Color } from './Color.js';
export class Note {
	#name;
	constructor(name, text, date, color) {
		try {
			this.name = name;
			this.text = text;
			this.date = new Date(date);
			this.color = new Color(color);
		} catch (e) {
			throw e;
		}
	}
	get name() {
		return this.#name;
	}
	set name(value) {
		if (typeof value !== 'string') throw new Error('Value is not a string');
		if (value.length > 20) throw new Error("Note Name can't be longer than 20 characters");
		this.#name = value;
	}

	#text;
	get text() {
		return this.#text;
	}
	set text(value) {
		if (typeof value !== 'string') throw new Error('Value is not a string');
		this.#text = value;
	}

	#date;
	get date() {
		return this.#date;
	}
	set date(value) {
		if (!(value instanceof Date)) throw new Error('Value is not a date');
		if (!isFinite(value.getDate())) throw new Error('Invalid date object');
		this.#date = new Date(value);
	}
}
