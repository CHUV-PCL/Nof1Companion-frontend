import { TestData } from '../src/entities/nof1Data';
import { Variable, VariableType } from '../src/entities/variable';
import { formatGraphData } from '../src/utils/charts';

describe('formatGraphData', () => {
	const testData: TestData = [
		{
			day: 1,
			substance: 'Aspirine',
			date: new Date('2022-07-06T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '110' },
				{ variableName: 'Médicament pris', value: 'dafalgan' },
				{ variableName: 'Couleur', value: 'bleu' },
				{ variableName: 'Douleur', value: '10' },
			],
		},
		{
			day: 2,
			substance: 'Aspirine',
			date: new Date('2022-07-07T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'non' },
				{ variableName: 'TA SYS', value: '111' },
				{ variableName: 'Médicament pris', value: '' },
				{ variableName: 'Couleur', value: 'vert' },
				{ variableName: 'Douleur', value: '11' },
			],
		},
		{
			day: 3,
			substance: 'Aspirine',
			date: new Date('2022-07-08T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '112' },
				{ variableName: 'Médicament pris', value: 'dafalgan1' },
				{ variableName: 'Couleur', value: 'jaune' },
				{ variableName: 'Douleur', value: '12' },
			],
		},
		{
			day: 4,
			substance: 'Placebo',
			date: new Date('2022-07-09T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '113' },
				{ variableName: 'Médicament pris', value: 'dafalgan2' },
				{ variableName: 'Couleur', value: 'bleu' },
				{ variableName: 'Douleur', value: '13' },
			],
		},
		{
			day: 5,
			substance: 'Placebo',
			date: new Date('2022-07-10T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '114' },
				{ variableName: 'Médicament pris', value: 'dafalgan3' },
				{ variableName: 'Couleur', value: 'vert' },
				{ variableName: 'Douleur', value: '14' },
			],
		},
		{
			day: 6,
			substance: 'Placebo',
			date: new Date('2022-07-11T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '115' },
				{ variableName: 'Médicament pris', value: 'dafalgan4' },
				{ variableName: 'Couleur', value: 'jaune' },
				{ variableName: 'Douleur', value: '15' },
			],
		},
		{
			day: 7,
			substance: 'Aspirine',
			date: new Date('2022-07-12T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '116' },
				{ variableName: 'Médicament pris', value: 'dafalgan5' },
				{ variableName: 'Couleur', value: 'bleu' },
				{ variableName: 'Douleur', value: '16' },
			],
		},
		{
			day: 8,
			substance: 'Aspirine',
			date: new Date('2022-07-13T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'oui' },
				{ variableName: 'TA SYS', value: '117' },
				{ variableName: 'Médicament pris', value: 'dafalgan6' },
				{ variableName: 'Couleur', value: 'vert' },
				{ variableName: 'Douleur', value: '17' },
			],
		},
		{
			day: 9,
			substance: 'Aspirine',
			date: new Date('2022-07-14T15:57:56.565Z'),
			data: [
				{ variableName: 'Bonheur', value: 'non' },
				{ variableName: 'TA SYS', value: '118' },
				{ variableName: 'Médicament pris', value: 'dafalgan7' },
				{ variableName: 'Couleur', value: 'jaune' },
				{ variableName: 'Douleur', value: '18' },
			],
		},
	];
	const variable: Variable = {
		name: 'Douleur',
		type: VariableType.VAS,
		desc: 'bla',
	};

  const res = [
		{ day: 0 },
		{ day: 1, Aspirine: '10' },
		{ day: 2, Aspirine: '11' },
		{ day: 3, Aspirine: '12' },
		{ day: 4, Placebo: '13' },
		{ day: 5, Placebo: '14' },
		{ day: 6, Placebo: '15' },
		{ day: 7, Aspirine: '16' },
		{ day: 8, Aspirine: '17' },
		{ day: 9, Aspirine: '18' },
	];

	it('should format graph data correctly', () => {
		const graphData = formatGraphData(testData, variable);
    expect(graphData).toEqual(res);
	});
});
