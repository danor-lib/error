import type { RichErrorOption } from '../types.ts';



export class RichError extends Error {
	/**
	 * RichError
	 * @param {RichErrorOption} [options]
	 */
	constructor(options?: RichErrorOption);


	/** A lower-case slug string that identifies the specific error type or category */
	code?: string;
	/** A approximate location string where the error originated */
	at?: string;
	/** Additional contextual data associated with the error occurrence */
	data?: unknown;
	/** A pruned version of `.data` */
	datasPruned?: string[];
	/** A function for pruning `.data` */
	pruner?: (data: unknown) => string[] | Promise<string[]>;
	/** A boolean flag indicating whether the error is internal and should not be exposed to end users */
	internal?: boolean;


	/** Return the first error in the error chain based on the `cause` property */
	get root(): Error;

	/**
	 * Prune data with pruner function
	 * @returns {Promise<string[]>}
	 */
	prune(): Promise<string[]>;
}
