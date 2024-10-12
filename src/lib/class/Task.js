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
}
