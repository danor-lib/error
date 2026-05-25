/** Options used to construct a `RichError` */
export type RichErrorOption = {
	/** A human-readable description of the error */
	message?: string;

	/** A value indicating the specific cause of the error */
	cause?: unknown;

	/** A lower-case slug string that identifies the specific error type or category */
	code?: string;

	/** A approximate location string where the error originated */
	at?: string;

	/** Additional contextual data associated with the error occurrence */
	data?: unknown;

	/** A pruned version of `.data` */
	datasPruned?: string[];

	/**
	 * A function for pruning `.data`
	 * @param {unknown} data
	 * @returns {string[]}
	 */
	pruner?: (data: unknown) => string[]|Promise<string[]>;

	/** A boolean flag indicating whether the error is internal and should not be exposed to end users */
	internal?: boolean;
};
