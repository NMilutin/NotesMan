import { Color } from './Color.svelte.js';
export class Note {
	#id;
	get id() {
		return this.#id;
	}
	constructor(id, name, text, date, backgroundColor, textColor) {
		try {
			this.#id = id;
			this.name = name;
			this.text = text;
			this.date = new Date(date);
			this.backgroundColor = backgroundColor;
			this.textColor = textColor;
		} catch (e) {
			throw e;
		}
	}
	#name = $state();
	get name() {
		return this.#name;
	}
	set name(value) {
		if (typeof value !== 'string') throw new Error('Value is not a string');
		if (value.length > 20) throw new Error("Note Name can't be longer than 20 characters");
		this.#name = value;
	}

	#text = $state();
	get text() {
		return this.#text;
	}
	set text(value) {
		if (typeof value !== 'string') throw new Error('Value is not a string');
		this.#text = value;
	}

	#date = $state();
	get date() {
		return this.#date;
	}
	set date(value) {
		if (!(value instanceof Date)) throw new Error('Value is not a date');
		if (!isFinite(value.getDate())) throw new Error('Invalid date object');
		this.#date = new Date(value);
	}
	#color = $state({
		background: new Color('#DFDFCF'),
		text: new Color('#000')
	});
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
	toJSON() {
		return JSON.stringify({
			id: this.#id,
			name: this.#name,
			text: this.#text,
			date: this.#date.toISOString(),
			backgroundColor: this.backgroundColor,
			textColor: this.textColor
		});
	}
}
