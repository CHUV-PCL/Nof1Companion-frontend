import { RandomStrategy } from '../src/utils/nof1-lib/randomizationStrategy';
import { anova, AnalyseType } from '../src/utils/statistics';

const substances = [
	{
		name: 'A',
		abbreviation: 'A',
		unit: 'g',
	},
	{
		name: 'B',
		abbreviation: 'B',
		unit: 'g',
	},
];
const nbPeriods = 4,
	periodLen = 4,
	skippedRunInDays = 2;
let day = 1;
const testData = [
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '22.9',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '24.1',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '21.3',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '25.1',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '34.2',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '35.1',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '42.9',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '43.6',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '36.3',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '36.4',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '25',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'A',
		data: [
			{
				variableName: 'douleur',
				value: '30',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '37.3',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '39.4',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '45',
			},
		],
	},
	{
		day: day++,
		date: new Date(),
		substance: 'B',
		data: [
			{
				variableName: 'douleur',
				value: '43.1',
			},
		],
	},
];

describe('Naive ANOVA', () => {
	const result = {
		treatment: {
			effect: [25.35, 43.65],
			SS: 669.7799999999997,
			DF: 1,
			MS: 669.7799999999997,
			F: 98.25623471882506,
			P: 0.000060897655599467804,
		},
		residual: {
			SS: 40.900000000000546,
			DF: 6,
			MS: 6.816666666666758,
		},
		total: {
			mean: 34.5,
			SS: 710.6800000000003,
			DF: 7,
			MS: 101.52571428571433,
		},
	};

	it('should run correctly', () => {
		const x = anova(
			AnalyseType.NaiveANOVA,
			{ name: 'douleur', skippedRunInDays },
			{ substances, periodLen },
			testData,
		);
		expect(x).toEqual(result);
	});
});

describe('Cycle ANOVA', () => {
	const result = {
		treatment: {
			effect: [25.35, 43.65],
			SS: 669.7799999999997,
			DF: 1,
			MS: 669.7799999999997,
			F: 109.35183673469383,
			P: 0.06069437648379972,
		},
		cycle: {
			SS: 13.00499999999997,
			DF: 1,
			MS: 13.00499999999997,
			F: 2.1232653061224442,
			P: 0.3828979541361772,
		},
		treatmentCycle: {
			SS: 6.125,
			DF: 1,
			MS: 6.125,
		},
		residual: {
			SS: 21.770000000000664,
			DF: 4,
			MS: 5.442500000000166,
		},
		total: {
			mean: 34.5,
			SS: 710.6800000000003,
			DF: 7,
			MS: 101.52571428571433,
		},
	};

	it('should run correctly', () => {
		const x = anova(
			AnalyseType.CycleANOVA,
			{ name: 'douleur', skippedRunInDays },
			{
				substances,
				periodLen,
				nbPeriods,
				randomization: { strategy: RandomStrategy.Permutations },
			},
			testData,
		);
		expect(x).toEqual(result);
	});
});

describe('ANCOVA Autoregression', () => {
	const result = {
		treatment: {
			effect: [37.363922651933954, 33.536077348066044],
			SS: 0.3002201023730855,
			DF: 1,
			MS: 0.3002201023730855,
			F: 0.07374132991204935,
			P: 0.8311943735670269,
		},
		autoregr: {
			SS: 8.058740331491887,
			DF: 1,
			MS: 8.058740331491887,
			F: 1.9794218467142735,
			P: 0.3933797784433941,
		},
		meta: {
			slope: 0.9436464088398034,
			intercept: 5.704585635358551,
			corr: 1.2618376823940292,
		},
		residual: {
			SS: 4.0712596685082225,
			DF: 1,
			MS: 4.0712596685082225,
		},
		total: {
			mean: 35.45,
			SS: 261.7699999999995,
			DF: 3,
			MS: 87.2566666666665,
		},
	};

	it('should run correctly', () => {
		const x = anova(
			AnalyseType.ANCOVAautoregr,
			{ name: 'douleur', skippedRunInDays },
			{
				substances,
				periodLen,
				randomization: { strategy: RandomStrategy.Permutations },
			},
			testData,
		);
		expect(x).toEqual(result);
	});
});
