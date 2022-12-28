import { TestData } from '../entities/nof1Data';
import { Substance } from '../entities/substance';
import { Variable } from '../entities/variable';

/**
 * Format test data to a compatible format for charts.
 * @param testData Health variables data.
 * @param variable Concerned variable, to represent on the chart.
 * @returns The formatted data for the concerned variable.
 */
export const formatGraphData = (
	testData: TestData,
	variable: Variable,
) => {
	const graphData: { [key: string]: string | number }[] = [{ day: 0 }];
	testData.map((d) => {
		const v = d.data.find((v) => v.variableName === variable.name);
		const entry: { [key: string]: string | number } = {};
		entry['day'] = d.day;
		entry[d.substance] = v!.value;
		graphData.push(entry);
	});
	return graphData;
};

/**
 * Retrieve the current substance of the current period.
 * @param day Day number.
 * @param periodLen Period length.
 * @param substancesSeq Substance administration sequence selected for the N-of-1 test.
 * @param substances Array of substances of the N-of-1 test.
 * @returns The current substance of the current period.
 */
export const currentSubstance = (
	day: number,
	periodLen: number,
	substancesSeq: string[],
	substances: Substance[],
) => {
	const abbrev = substancesSeq[(day - 1) / periodLen];
	const sub = substances.find((s) => s.abbreviation === abbrev);
	return sub?.name;
};
