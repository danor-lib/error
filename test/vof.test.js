import assert from 'node:assert/strict';
import { test } from 'node:test';

import { vof } from '../src/vof.pure.js';



test('vof identifies empty, null, undefined, and strings', () => {
	assert.equal(vof(''), 'string(0)');
	assert.equal(vof(null), 'null');
	assert.equal(vof(undefined), 'undefined');
	assert.equal(vof('abc'), 'string(3)');
});


test('vof identifies numbers, bigint, booleans, and symbols', () => {
	assert.equal(vof(42), 'number');
	assert.equal(vof(Number.NaN), 'number(nan)');
	assert.equal(vof(Infinity), 'number(infinity)');
	assert.equal(vof(-Infinity), 'number(-infinity)');
	assert.equal(vof(-0), 'number(-0)');
	assert.equal(vof(42n), 'bigint');
	assert.equal(vof(true), 'boolean');
	assert.equal(vof(false), 'boolean');
	assert.equal(vof(Symbol('answer')), 'symbol(answer)');
	assert.equal(vof(Symbol()), 'symbol');
});


test('vof identifies function kinds and names using the function(...) format', () => {
	function namedFunction() {}
	async function namedAsyncFunction() {}
	function* namedGeneratorFunction() {}
	async function* namedAsyncGeneratorFunction() {}
	class NamedClass {}

	assert.equal(vof(namedFunction), 'function(namedFunction)');
	assert.equal(vof(namedAsyncFunction), 'function<async>(namedAsyncFunction)');
	assert.equal(vof(namedGeneratorFunction), 'function<generator>(namedGeneratorFunction)');
	assert.equal(vof(namedAsyncGeneratorFunction), 'function<async-generator>(namedAsyncGeneratorFunction)');
	assert.equal(vof(NamedClass), 'class(NamedClass)');
});


test('vof omits the name suffix for anonymous functions and classes', () => {
	assert.equal(vof(() => {}), 'function');
	assert.equal(vof(async () => {}), 'function<async>');
	assert.equal(vof(function () {}), 'function');
	assert.equal(vof(class {}), 'class');
});


test('vof identifies arrays, errors, and plain objects', () => {
	assert.equal(vof([]), 'array(0)');
	assert.equal(vof([1, 2, 3]), 'array(3)');
	assert.equal(vof(new Error('boom')), 'error(Error)');
	assert.equal(vof(new TypeError('boom')), 'error(TypeError)');
	assert.equal(vof({ a: 1 }), 'object');
	assert.equal(vof(Object.create(null)), 'object');
	assert.equal(vof(new (class Foo {})()), 'object');
});


test('vof falls back to instanceof Error when Error.isError is missing', () => {
	const isError = Error.isError;

	delete Error.isError;
	const result = vof(new TypeError('boom'));
	Error.isError = isError;

	assert.equal(result, 'error(TypeError)');
});


test('vof identifies map and set sizes', () => {
	assert.equal(vof(new Map()), 'map(0)');
	assert.equal(vof(new Map([[1, 1]])), 'map(1)');
	assert.equal(vof(new Set()), 'set(0)');
	assert.equal(vof(new Set([1, 2])), 'set(2)');
});


test('vof identifies built-in object types', () => {
	assert.equal(vof(new Promise(() => {})), 'promise');
	assert.equal(vof(/abc/g), 'regexp');
	assert.equal(vof(new Date('2024-01-01T00:00:00Z')), 'date');
	assert.equal(vof(new WeakMap()), 'weakmap');
	assert.equal(vof(new WeakSet()), 'weakset');
});


test('vof identifies array buffer and data view types', () => {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);

	assert.equal(vof(buffer), 'arraybuffer(8)');
	assert.equal(vof(view), 'dataview(8)');
	assert.equal(vof(new DataView(buffer, 2)), 'dataview(6)');
});


test('vof identifies typed arrays', () => {
	assert.equal(vof(new Int8Array([1, 2, 3])), 'typed-array<int8>(3)');
	assert.equal(vof(new Uint8Array([1, 2, 3])), 'typed-array<uint8>(3)');
	assert.equal(vof(new Uint8ClampedArray([1, 2, 3])), 'typed-array<uint8clamped>(3)');
	assert.equal(vof(new Int16Array([1, 2])), 'typed-array<int16>(2)');
	assert.equal(vof(new Uint16Array([1, 2])), 'typed-array<uint16>(2)');
	assert.equal(vof(new Int32Array([1, 2])), 'typed-array<int32>(2)');
	assert.equal(vof(new Uint32Array([1, 2])), 'typed-array<uint32>(2)');
	assert.equal(vof(new Float32Array([1.5])), 'typed-array<float32>(1)');
	assert.equal(vof(new Float64Array([1.5, 2.5])), 'typed-array<float64>(2)');
	assert.equal(vof(new BigInt64Array([1n])), 'typed-array<bigint64>(1)');
	assert.equal(vof(new BigUint64Array([1n])), 'typed-array<biguint64>(1)');
});
