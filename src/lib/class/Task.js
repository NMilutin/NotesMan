import { te } from 'date-fns/locale';
import { Color } from './Color.js';
import { Note } from './Note.js';
export class Task extends Note {
	#done = false;
	get done() {
		return this.#done;
	}
	set done(value) {
		if (typeof value !== 'boolean') throw new Error('Value is not a boolean');
		this.#done = value;
	}
	constructor(id, name, text, date, backgroundColor, textColor, done = false) {
		super(id, name, text, date, backgroundColor, textColor);
		this.done = done;
	}
	toJSON() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			text: this.text,
			date: this.date.toISOString(),
			backgroundColor: this.backgroundColor,
			textColor: this.textColor,
      done: this.#done
		});
	}
}
