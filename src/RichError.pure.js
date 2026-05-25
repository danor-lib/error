/** @import { RichErrorOption } from '../types.ts' */



/** RichError */
export class RichError extends Error {
	/**
	 * RichError
	 * @param {RichErrorOption} [options]
	 */
	constructor(options = {}) {
		super(options?.message, 'cause' in options ? { cause: options.cause } : {});

		this.name = 'RichError';
		this.stack = this.stack?.replace(/^\s*?at( new)? RichError \(.*?$\n/m, '');

		if('code' in options) { this.code = options?.code; }
		if('at' in options) { this.at = options?.at; }
		if('data' in options) { this.data = options?.data; }
		if('datasPruned' in options) { this.datasPruned = options?.datasPruned; }
		if('pruner' in options) { this.pruner = options?.pruner; }
		if('internal' in options) { this.internal = options?.internal; }
	}


	/** @returns {Error} */
	get root() {
		let errorRoot = this;

		while(errorRoot?.cause instanceof Error) {
			errorRoot = errorRoot.cause;
		}

		return errorRoot;
	}


	/**
	 * Prune data with pruner function
	 * @returns {Promise<string[]>}
	 */
	async prune() {
		if(this.datasPruned) { return this.datasPruned; }


		const pruner = this.pruner;
		if(typeof pruner != 'function') { return; }

		return this.datasPruned = await pruner(this.data);
	}
}
