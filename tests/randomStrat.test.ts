import {
	MaxRep,
	Permutation,
	permutations,
	permutateWithRepetitions,
	Randomization,
} from '../src/utils/nof1-lib/randomizationStrategy';

const seq2 = ['1', '2'];
const seq3 = ['1', '2', '3'];
const seq4 = ['1', '2', '3', '4'];

let rnd: Randomization;

describe('Permutation class', () => {
	const perms2 = permutations(seq2);
	const perms3 = permutations(seq3);
	const perms4 = permutations(seq4);

	rnd = new Permutation();

	it('should randomize correctly seq[1,2], with even periods nb (6)', () => {
		const nbPeriods = 6;
		const allPerms = permutateWithRepetitions(
			perms2,
			Math.ceil(nbPeriods / seq2.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq2, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});

	it('should randomize correctly seq[1,2], with odd periods nb (7)', () => {
		const nbPeriods = 7;
		const allPerms = permutateWithRepetitions(
			perms2,
			Math.ceil(nbPeriods / seq2.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq2, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});

	it('should randomize correctly seq[1,2,3], with even periods nb (6)', () => {
		const nbPeriods = 6;
		const allPerms = permutateWithRepetitions(
			perms3,
			Math.ceil(nbPeriods / seq3.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq3, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});

	it('should randomize correctly seq[1,2,3], with odd periods nb (7)', () => {
		const nbPeriods = 7;
		const allPerms = permutateWithRepetitions(
			perms3,
			Math.ceil(nbPeriods / seq3.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq3, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});

	it('should randomize correctly seq[1,2,3,4], with even periods nb (6)', () => {
		const nbPeriods = 6;
		const allPerms = permutateWithRepetitions(
			perms4,
			Math.ceil(nbPeriods / seq4.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq4, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});

	it('should randomize correctly seq[1,2,3,4], with odd periods nb (7)', () => {
		const nbPeriods = 7;
		const allPerms = permutateWithRepetitions(
			perms4,
			Math.ceil(nbPeriods / seq4.length),
		).map((i) => i.flatMap((x) => x).slice(0, nbPeriods));
		const r = rnd.randomize(seq4, nbPeriods);
		expect(
			allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
		).toBeTruthy();
	});
});

describe('MaxRep class', () => {
	describe('seq[1,2], nbPriod = 4', () => {
		const nbPeriods = 4;
		it('should randomize correctly seq[1,2], with max rep = 1', () => {
			const allPerms = [
				['1', '2', '1', '2'],
				['2', '1', '2', '1'],
			];
			rnd = new MaxRep(1);
			const r = rnd.randomize(seq2, nbPeriods);
			expect(
				allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
			).toBeTruthy();
		});

		it('should randomize correctly seq[1,2], with max rep = 2', () => {
			const allPerms = [
				['1', '1', '2', '1'],
				['1', '1', '2', '2'],
				['1', '2', '1', '1'],
				['1', '2', '1', '2'],
				['1', '2', '2', '1'],
				['2', '2', '1', '2'],
				['2', '2', '1', '1'],
				['2', '1', '2', '2'],
				['2', '1', '2', '1'],
				['2', '1', '1', '2'],
			];
			rnd = new MaxRep(2);
			const r = rnd.randomize(seq2, nbPeriods);
			expect(
				allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
			).toBeTruthy();
		});

		it('should randomize correctly seq[1,2], with max rep = 3', () => {
			const allPerms = [
				['1', '1', '1', '2'],
				['1', '1', '2', '1'],
				['1', '1', '2', '2'],
				['1', '2', '1', '1'],
				['1', '2', '1', '2'],
				['1', '2', '2', '1'],
				['1', '2', '2', '2'],
				['2', '2', '2', '1'],
				['2', '2', '1', '2'],
				['2', '2', '1', '1'],
				['2', '1', '2', '2'],
				['2', '1', '2', '1'],
				['2', '1', '1', '2'],
				['2', '1', '1', '1'],
			];
			rnd = new MaxRep(3);
			const r = rnd.randomize(seq2, nbPeriods);
			expect(
				allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
			).toBeTruthy();
		});
	});

	describe('seq[1,2,3], nbPriod = 4', () => {
		const nbPeriods = 4;
		it('should randomize correctly seq[1,2,3], with max rep = 1', () => {
			const allPerms = [
				['1', '2', '3', '1'],
				['1', '2', '3', '2'],
				['1', '2', '1', '2'],
				['1', '2', '1', '3'],
				['1', '3', '1', '2'],
				['1', '3', '1', '3'],
				['1', '3', '2', '1'],
				['1', '3', '2', '3'],
				['2', '3', '1', '2'],
				['2', '3', '1', '3'],
				['2', '3', '2', '1'],
				['2', '3', '2', '3'],
				['2', '1', '2', '1'],
				['2', '1', '2', '3'],
				['2', '1', '3', '1'],
				['2', '1', '3', '2'],
				['3', '1', '2', '1'],
				['3', '1', '2', '3'],
				['3', '1', '3', '1'],
				['3', '1', '3', '2'],
				['3', '2', '3', '1'],
				['3', '2', '3', '2'],
				['3', '2', '1', '2'],
				['3', '2', '1', '3'],
			];
			rnd = new MaxRep(1);
			const r = rnd.randomize(seq3, nbPeriods);
			expect(
				allPerms.some((p) => JSON.stringify(p) === JSON.stringify(r)),
			).toBeTruthy();
		});
	});
});
