export enum RandomStrategy {
	Permutations = 'Permutations',
	MaxRep = 'MaxRep',
	Custom = 'Custom',
}

export interface RandomizationStrategy {
	strategy: RandomStrategy;
	// optional options according to the strategy
	maxRep?: number;
	predefinedSeq?: string[];
}

/**
 * Generate all permutations, without repetitions, of the elements
 * of the array provided in parameter.
 * @param xs Array of elements to permute.
 * @returns An array of all permutations arrays.
 */
export function permutations<T>(xs: T[]): T[][] {
	if (!xs.length) return [[]];
	return xs.flatMap((x) => {
		// get permutations of xs without x, then prepend x to each
		return permutations(xs.filter((v) => v !== x)).map((vs) => [x, ...vs]);
	});
}

/**
 * Source : https://github.com/trekhleb/javascript-algorithms/blob/master/
 * src/algorithms/sets/permutations/permutateWithRepetitions.js
 * @param {*[]} permutationOptions
 * @param {number} permutationLength
 * @return {*[]}
 */
export function permutateWithRepetitions<T>(
	permutationOptions: T[],
	permutationLength = permutationOptions.length,
) {
	if (permutationLength === 1) {
		return permutationOptions.map((permutationOption) => [permutationOption]);
	}

	// Init permutations array.
	const permutations: T[][] = [];

	// Get smaller permutations.
	const smallerPermutations = permutateWithRepetitions(
		permutationOptions,
		permutationLength - 1,
	);

	// Go through all options and join it to the smaller permutations.
	permutationOptions.forEach((currentOption) => {
		smallerPermutations.forEach((smallerPermutation) => {
			permutations.push([currentOption].concat(smallerPermutation));
		});
	});

	return permutations;
}

/**
 * Retrieve a random element from an array.
 * @param arr Array of elements.
 * @returns A random element from the array.
 */
export function getRandomElemFromArray<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Abstract class defining a randomize method that randomize the elements of an array.
 * In this context, it is used to determine the randomized substances administration sequence.
 */
export abstract class Randomization {
	/**
	 * Generate an array of nbPeriods length with random elements from abbrevSeq.
	 * @param abbrevSeq Array of elements to pick from.
	 * @param nbPeriods Length of the output array.
	 */
	abstract randomize(abbrevSeq: string[], nbPeriods: number): string[];
}

/**
 * Implements the randomize method with a permutation without repetitions algorithm.
 */
export class Permutation extends Randomization {
	randomize(abbrevSeq: string[], nbPeriods: number): string[] {
		const perms = permutations(abbrevSeq);
		let selectedPerm = getRandomElemFromArray<string[]>(perms);
		while (selectedPerm.length < nbPeriods) {
			selectedPerm = selectedPerm.concat(
				getRandomElemFromArray<string[]>(perms),
			);
		}
		return selectedPerm.slice(0, nbPeriods);
	}
}

/**
 * Implements the randomize method with a maximum repetition of element algorithm.
 */
export class MaxRep extends Randomization {
	maxRep: number; // the number of maximum repetitions of an element in the output array.

	constructor(maxRep: number) {
		super();
		this.maxRep = maxRep;
	}

	randomize(abbrevSeq: string[], nbPeriods: number): string[] {
		const res: string[] = [];
		while (res.length < nbPeriods) {
			const r = getRandomElemFromArray(abbrevSeq);
			if (res.length === 0) {
				res.push(r);
			} else {
				// check the maximum repetition of an element.
				let endIterator = res.length - 1;
				let prev = res[endIterator];
				let repeated = 0;
				while (prev === r) {
					repeated++;
					--endIterator;
					prev = endIterator >= 0 ? res[endIterator] : '';
				}
				if (repeated < this.maxRep) {
					res.push(r);
				}
			}
		}
		return res;
	}
}

/**
 * Implements the randomize method for a custom strategy (custom predefined sequence).
 */
export class CustomSequence extends Randomization {
	predefinedSeq: string[]; // the predefined administration sequence.

	constructor(predefinedSeq: string[]) {
		super();
		this.predefinedSeq = predefinedSeq;
	}

	randomize(abbrevSeq: string[], nbPeriods: number): string[] {
		return this.predefinedSeq;
	}
}
