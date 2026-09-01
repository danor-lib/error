const typesObjectBuiltin = ['Promise', 'RegExp', 'Date', 'WeakMap', 'WeakSet'];
const typesTypedArray = [
	'Int8Array', 'Uint8Array', 'Uint8ClampedArray',
	'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
	'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
];


/**
 * Return a value type-identifier string
 * @param {unknown} value
 * @returns {string}
 */
export const vof = (value) => {
	const type = typeof value;

	if(type == 'string') { return `string(${value.length})`; }

	if(type == 'number') {
		if(Number.isNaN(value)) { return 'number(nan)'; }
		if(!Number.isFinite(value)) { return value > 0 ? 'number(infinity)' : 'number(-infinity)'; }
		if(Object.is(value, -0)) { return 'number(-0)'; }

		return 'number';
	}

	if(type == 'bigint') { return 'bigint'; }

	if(type == 'symbol') { return `symbol${value.description == undefined ? '' : `(${value.description})`}`; }

	if(type == 'function') {
		if(value.toString().trimStart().startsWith('class')) {
			return 'class' + (value.name ? `(${value.name})` : '');
		}


		let typeFunction = '';

		const nameConstructor = value.constructor.name;
		if(nameConstructor == 'AsyncFunction') { typeFunction = 'async'; }
		else if(nameConstructor == 'GeneratorFunction') { typeFunction = 'generator'; }
		else if(nameConstructor == 'AsyncGeneratorFunction') { typeFunction = 'async-generator'; }

		return 'function' + (typeFunction ? `<${typeFunction}>` : '') + (value.name ? `(${value.name})` : '');
	}

	if(type == 'object') {
		if(value == null) { return 'null'; }
		if(Array.isArray(value)) { return `array(${value.length})`; }
		if(Error.isError ? Error.isError(value) : value instanceof Error) { return `error(${value.name})`; }

		const match = Object.prototype.toString.call(value).match(/^\[object (.+)\]$/);
		if(match) {
			const typeObject = match[1];

			if(typeObject == 'Map') { return `map(${value.size})`; }
			if(typeObject == 'Set') { return `set(${value.size})`; }
			if(typeObject == 'ArrayBuffer') { return `arraybuffer(${value.byteLength})`; }
			if(typeObject == 'DataView') { return `dataview(${value.byteLength})`; }


			if(typesTypedArray.includes(typeObject)) {
				return `typed-array<${typeObject.toLowerCase().replace('array', '')}>(${value.length})`;
			}

			if(typesObjectBuiltin.includes(typeObject)) {
				return typeObject.toLowerCase();
			}
		}

		return 'object';
	}

	return type;
};
