import { Color } from './Color.js';
export class Note {
	#name;
	constructor(name, text, date, backgroundColor, textColor) {
		try {
			this.name = name;
			this.text = text;
			this.date = new Date(date);
			this.backgroundColor = backgroundColor;
			this.textColor = textColor;
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
	#color = {
		background: new Color('#DFDFCF'),
		text: new Color('#000')
	};
	get backgroundColor() {
		return this.#color.background.hex;
	}
	set backgroundColor(value) {
		try {
			this.#color.background.hex = value;
		} catch (e) {
			throw e;
		}
	}
	get textColor() {
		return this.#color.text.hex;
	}
	set textColor(value) {
		try {
			this.#color.text.hex = value;
		} catch (e) {
			throw e;
		}
	}
}
