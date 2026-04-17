import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { RichError, InternalRichError } from '../src/RichError.js';



describe('RichError', () => {
	it('should accept without message and options', () => {
		const error = new RichError();


		assert.ok(error instanceof Error);
		assert.ok(error instanceof InternalRichError);
		assert.ok(error instanceof RichError);

		assert.strictEqual(error.name, 'RichError');

		assert.strictEqual(error.message, '');
		assert.strictEqual(error.cause, undefined);

		assert.strictEqual(error.code, undefined);
		assert.strictEqual(error.at, undefined);
		assert.strictEqual(error.data, undefined);
		assert.strictEqual(error.internal, undefined);

		assert.ok(error.stack);
	});


	it('should be created without \'new\'', () => {
		const error2 = RichError();


		assert.ok(error2 instanceof Error);
		assert.ok(error2 instanceof InternalRichError);
		assert.ok(error2 instanceof RichError);

		assert.strictEqual(error2.name, 'RichError');

		assert.strictEqual(error2.message, '');
		assert.strictEqual(error2.cause, undefined);

		assert.strictEqual(error2.code, undefined);
		assert.strictEqual(error2.at, undefined);
		assert.strictEqual(error2.data, undefined);
		assert.strictEqual(error2.internal, undefined);

		assert.ok(error2.stack);
	});


	it('should accept only message', () => {
		const message = 'Only message';
		const error = RichError(message);


		assert.ok(error instanceof Error);
		assert.ok(error instanceof InternalRichError);
		assert.ok(error instanceof RichError);

		assert.strictEqual(error.name, 'RichError');

		assert.strictEqual(error.message, message);
		assert.strictEqual(error.cause, undefined);
		assert.ok('cause' in error == false);

		assert.strictEqual(error.code, undefined);
		assert.ok('code' in error == false);
		assert.strictEqual(error.at, undefined);
		assert.ok('at' in error == false);
		assert.strictEqual(error.data, undefined);
		assert.ok('data' in error == false);
		assert.strictEqual(error.internal, undefined);
		assert.ok('internal' in error == false);

		assert.ok(error.stack);
	});


	it('should set all options correctly', () => {
		const message = 'Test options';
		const options = {
			at: 'test-richerror',
			code: 42,
			data: { id: 123 },
			cause: new Error('original cause'),
			internal: false,
		};
		const error = new RichError(message, options);


		assert.ok(error instanceof Error);
		assert.ok(error instanceof InternalRichError);
		assert.ok(error instanceof RichError);

		assert.strictEqual(error.name, 'RichError');

		assert.strictEqual(error.message, message);
		assert.strictEqual(error.cause, options.cause);
		assert.ok('cause' in error);

		assert.strictEqual(error.code, options.code);
		assert.ok('code' in error);
		assert.strictEqual(error.at, options.at);
		assert.ok('at' in error);
		assert.deepStrictEqual(error.data, options.data);
		assert.ok('data' in error);
		assert.strictEqual(error.internal, options.internal);
		assert.ok('internal' in error);
	});


	it('should modify stack to remove the first line containing "at new RichError"', () => {
		const error = new RichError();

		assert.ok(typeof error.stack == 'string');

		assert.ok(!error.stack.includes('at new RichError'));
		assert.ok(!error.stack.includes('at RichError'));
	});


	describe('.root (getter)', () => {
		it('should have root getter returning itself when no cause', () => {
			const error = new RichError();

			assert.strictEqual(error.root, error);
		});

		it('should have root getter returning the ultimate cause error', () => {
			const error3 = new Error('level 3');
			const error2 = new Error('level 2', { cause: error3 });
			const error = new RichError('level 1', { cause: error2 });

			assert.strictEqual(error.root, error3);
		});


		it('should stop root traversal when cause is not an Error', () => {
			const error3 = new Error('level 3');
			const error2 = { cause: error3 };
			const error = new RichError('level 1', { cause: error2 });

			assert.strictEqual(error.root, error);
		});
	});


	it('should be able to extend RichError further', () => {
		class CustomError extends RichError { }

		const error = new CustomError('custom');

		assert.ok(error instanceof CustomError);
		assert.ok(error instanceof RichError);
		assert.ok(error instanceof Error);

		assert.strictEqual(error.name, 'CustomError');
		assert.strictEqual(error.message, 'custom');
	});
});
