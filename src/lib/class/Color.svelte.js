export class Color {
	#r = $state();
	#g = $state();
	#b = $state();
	#allowedChars = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'a',
		'B',
		'b',
		'C',
		'c',
		'D',
		'd',
		'E',
		'e',
		'F',
		'f'
	];
	constructor(...args) {
		try {
			if (typeof args.at(0) === 'string') {
				if (!(args.length === 1 || args.length === 3))
					throw new Error('Invalid number of arguments');
				if (args.length === 1) this.hex = args.at(0);
				if (args.length === 3) this.hex = `#${args.join('')}`;
			} else if (args.at(0) instanceof Color) {
				this.hex = args.at(0).hex;
			}
		} catch (e) {
			throw e;
		}
	}
	get hex() {
		if (this.#r && this.#g && this.#b) return `#${this.#r}${this.#g}${this.#b}`;
	}
	set hex(value) {
		if (typeof value !== 'string') throw new Error('Value is not a string');
		if (!(value.length === 7 || value.length === 4))
			throw new Error('Invalid color format! Correct: #AABBCC or #ABC');
		if (value.at(0) !== '#') throw new Error('Invalid color format! Correct: #AABBCC or #ABC');
		for (let i = 1; i < value.length; i++)
			if (!this.#allowedChars.includes(value.at(i)))
				throw new Error('Invalid color format! Bad number format');
		if (value.length === 7) {
			this.#r = value.slice(1, 3);
			this.#g = value.slice(3, 5);
			this.#b = value.slice(5, 7);
		} else if (value.length === 4) {
			this.#r = value.at(1).repeat(2);
			this.#g = value.at(2).repeat(2);
			this.#b = value.at(3).repeat(2);
		}
	}
}
