import assert from 'node:assert/strict';
import { test } from 'node:test';

import { RichError } from '../src/RichError.pure.js';



test('RichError should be constructible without message or options', () => {
	const error = new RichError();

	assert.ok(error instanceof Error);
	assert.ok(error instanceof RichError);

	assert.equal(error.name, 'RichError');

	assert.equal(error.message, '');
	assert.equal(error.cause, undefined);

	assert.equal(error.code, undefined);
	assert.equal(error.at, undefined);
	assert.equal(error.data, undefined);
	assert.equal(error.internal, undefined);


	assert.ok(error.stack);
});


test('RichError sets all options correctly', () => {
	const options = {
		message: 'Test options',
		at: 'test-richerror',
		code: 42,
		data: { id: 123 },
		cause: new Error('original cause'),
		internal: false,
	};
	const error = new RichError(options);


	assert.ok(error instanceof Error);
	assert.ok(error instanceof RichError);

	assert.equal(error.name, 'RichError');

	assert.equal(error.message, options.message);
	assert.equal(error.cause, options.cause);
	assert.ok('cause' in error);

	assert.equal(error.code, options.code);
	assert.ok('code' in error);
	assert.equal(error.at, options.at);
	assert.ok('at' in error);
	assert.deepEqual(error.data, options.data);
	assert.ok('data' in error);
	assert.equal(error.internal, options.internal);
	assert.ok('internal' in error);
});


test('RichError stack trace does not contain the constructor call line', () => {
	const error = new RichError();

	assert.ok(typeof error.stack == 'string');

	assert.ok(!error.stack.includes('at new RichError'));
});


test('RichError .root getter returns itself when there is no cause chain', () => {
	const error = new RichError();

	assert.equal(error.root, error);
});

test('RichError .root getter returns the ultimate cause when cause chain exists', () => {
	const error3 = new Error('level 3');
	const error2 = new Error('level 2', { cause: error3 });
	const error = new RichError({ message: 'level 1', cause: error2 });

	assert.equal(error.root, error3);
});

test('RichError .root getter stops traversal if cause is not an Error object', () => {
	const error3 = new Error('level 3');
	const error2 = { cause: error3 };
	const error = new RichError({ message: 'level 1', cause: error2 });

	assert.equal(error.root, error);
});


test('RichError can be extended to create custom error classes', () => {
	class CustomError extends RichError {
		constructor(options) {
			super(options);

			this.name = 'CustomError';
		}
	}

	const error = new CustomError({ message: 'custom' });

	assert.ok(error instanceof CustomError);
	assert.ok(error instanceof RichError);
	assert.ok(error instanceof Error);

	assert.equal(error.name, 'CustomError');
	assert.equal(error.message, 'custom');
});
