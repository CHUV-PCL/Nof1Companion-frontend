import { utils, WorkSheet, writeFileXLSX } from 'xlsx';
import { AdministrationSchema } from '../entities/nof1Test';
import { Substance } from '../entities/substance';

const defaultCellWidth = 10;

/**
 * Exports data to a XLSX file and triggers the file download.
 * @param filename Filename.
 * @param rows Array of data to export.
 * @param headers Array containing data header.
 */
export const generateXLSX = async (
	filename: string,
	rows: (string | number)[][],
	headers: string[][],
) => {
	const workbook = utils.book_new();
	workbook.Props = {
		Title: filename,
		CreatedDate: new Date(),
	};

	// headers
	const worksheet = utils.aoa_to_sheet(headers);
	// data
	utils.sheet_add_aoa(worksheet, rows, {
		origin: -1,
	});

	// use last header row to determine column widths.
	worksheet['!cols'] = headers[headers.length - 1].map((h) => ({
		wch: Math.max(h.length, defaultCellWidth),
	}));

	utils.book_append_sheet(workbook, worksheet, filename);

	writeFileXLSX(workbook, `${filename}.xlsx`);
};

export type XlsxSchema = (AdministrationSchema[number] & {
	morningUnit: number;
	noonUnit: number;
	eveningUnit: number;
	nightUnit: number;
})[];

/**
 * Formats the substances administration schema data for the xlsx export.
 * @param schema Substances administration schema.
 * @returns The formatted schema.
 */
export const formatSchema = (schema: AdministrationSchema): XlsxSchema => {
	const unitaryDose = (dose: number, fraction: number) => {
		if (fraction === 0 || dose === 0) return 0;
		return Math.round((dose / fraction) * 100) / 100;
	};

	return schema.map((row) => {
		return {
			day: row.day + 1, // 0 indexed
			substance: row.substance,
			unit: row.unit,
			morning: row.morning,
			morningFraction: row.morningFraction,
			morningUnit: unitaryDose(row.morning, row.morningFraction),
			noon: row.noon,
			noonFraction: row.noonFraction,
			noonUnit: unitaryDose(row.noon, row.noonFraction),
			evening: row.evening,
			eveningFraction: row.eveningFraction,
			eveningUnit: unitaryDose(row.evening, row.eveningFraction),
			night: row.night,
			nightFraction: row.nightFraction,
			nightUnit: unitaryDose(row.night, row.nightFraction),
		};
	});
};

/**
 * Helper method to calculate the number of doses for each substance dosage.
 * @param unitaryDoseEnum Array of the different dosages (unique).
 * @param unitaryDoseCount Array of counters for the different dosages.
 * @param doseEnum Current dosage to calculate.
 * @param fraction Number of doses for the current dosage.
 */
const count = (
	unitaryDoseEnum: number[],
	unitaryDoseCount: number[],
	doseEnum: number,
	fraction: number,
) => {
	if (fraction === 0 || doseEnum === 0) return;

	if (unitaryDoseEnum.includes(doseEnum)) {
		const doseIdx = unitaryDoseEnum.indexOf(doseEnum);
		unitaryDoseCount[doseIdx] += fraction;
	} else {
		unitaryDoseEnum.push(doseEnum);
		unitaryDoseCount[unitaryDoseEnum.indexOf(doseEnum)] = fraction;
	}
};

/**
 * Calculates the number of doses for each substance dosage.
 * @param substanceName Name of the substance.
 * @param row A day of posology.
 * @param addTotal Closure to calculate the total amount of the substance.
 * @param addTotalDoses Closure to calculate the total number of doses.
 * @param doseEnum Set of dosage to calculate the amount of.
 * @param doseCount Set of counters for each dosage.
 */
const countDoses = (
	substanceName: string,
	row: XlsxSchema[number],
	addTotal: (x: number) => number,
	addTotalDoses: (x: number) => number,
	doseEnum: number[],
	doseCount: number[],
) => {
	if (row.substance === substanceName) {
		addTotal(row.morning + row.noon + row.evening + row.night);
		addTotalDoses(
			row.morningFraction +
				row.noonFraction +
				row.eveningFraction +
				row.nightFraction,
		);
		count(doseEnum, doseCount, row.morningUnit, row.morningFraction);
		count(doseEnum, doseCount, row.noonUnit, row.noonFraction);
		count(doseEnum, doseCount, row.eveningUnit, row.eveningFraction);
		count(doseEnum, doseCount, row.nightUnit, row.morningFraction);
	}
};

/**
 * For each substance, calculates the total number of doses with its amount and
 * the number of doses for each different dosage.
 * Format the output for an XLSX export, with header and data in an array of array.
 * @param substances The substances.
 * @param adminSchema The xlsx administration schema of substances.
 * @param decreaseSchema The xlsx decreasing dosage schema of substances.
 * @param trad Translation texts.
 * @returns An array of xlsx rows (array of array) containing dosage recapitulation
 * for each substance.
 */
export const substancesRecap = (
	substances: Substance[],
	adminSchema: XlsxSchema,
	decreaseSchema: XlsxSchema,
	trad: { qty: string; totalDose: string; unitDose: string },
) => {
	return substances.map((s) => {
		let total = 0;
		const addTotal = (x: number) => (total += x);
		let totalDoses = 0;
		const addTotalDoses = (x: number) => (totalDoses += x);
		const doseEnum: number[] = [];
		const doseCount: number[] = [];

		adminSchema.forEach((row) =>
			countDoses(s.name, row, addTotal, addTotalDoses, doseEnum, doseCount),
		);
		decreaseSchema.forEach((row) =>
			countDoses(s.name, row, addTotal, addTotalDoses, doseEnum, doseCount),
		);

		return [
			[`${trad.qty} "${s.name}":`],
			[total, s.unit],
			[totalDoses, trad.totalDose],
			...doseEnum.map((d, idx) => [doseCount[idx], trad.unitDose + d + s.unit]),
		];
	});
};

/**
 * Creates the participants worksheet.
 * @param patientInfos Patient information.
 * @param physicianInfos Physician information.
 * @param nof1PhysicianInfos Nof1 physician information.
 * @returns The participants worksheet.
 */
const wsParticipants = (
	patientInfos: string[][],
	physicianInfos: string[][],
	nof1PhysicianInfos: string[][],
) => {
	const participants = [
		...patientInfos,
		[''], // empty row (space)
		...physicianInfos,
		[''],
		...nof1PhysicianInfos,
	];
	const wsParticipants = utils.aoa_to_sheet(participants);
	// determine column cell width
	wsParticipants['!cols'] = patientInfos[1].map((e) => ({
		wch: Math.max(e.length, defaultCellWidth),
	}));

	return wsParticipants;
};

/**
 * Creates the substances administration schema worksheet.
 * @param schemaHeaders Headers.
 * @param lastHeader Last row of headers.
 * @param schema Administration schema.
 * @param comments Comments displayed next to the header.
 * @returns The substances administration schema worksheet.
 */
const wsAdministrationSchema = (
	schemaHeaders: string[][],
	lastHeader: string[],
	schema: XlsxSchema,
	comments: string[],
) => {
	// header
	const wsSchema = utils.aoa_to_sheet(schemaHeaders);
	wsSchema['!merges'] = [
		{ s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }, // A1:C1
		{ s: { c: 3, r: 0 }, e: { c: 5, r: 0 } }, // D1:F1
		{ s: { c: 6, r: 0 }, e: { c: 8, r: 0 } }, // G1:I1
		{ s: { c: 9, r: 0 }, e: { c: 11, r: 0 } }, // J1:L1
		{ s: { c: 12, r: 0 }, e: { c: 14, r: 0 } }, // M1:O1
	];
	// determine column widths using last header row
	wsSchema['!cols'] = lastHeader.map((h) => ({
		wch: Math.max(h.length, defaultCellWidth),
	}));

	// data
	utils.sheet_add_json(wsSchema, schema, {
		skipHeader: true,
		origin: -1,
	});
	// header comments
	utils.sheet_add_aoa(wsSchema, [comments], {
		origin: { r: 0, c: lastHeader.length + 1 },
	});

	return wsSchema;
};

/**
 * Adds the decreasing dosage schema below the substances administration schema.
 * @param wsSchema Substances administration schema.
 * @param decreasingSchema Decreasing dosage schema.
 */
const addDecreasingSchema = (
	wsSchema: WorkSheet,
	decreasingSchema: {
		headers: string[][];
		schema: XlsxSchema;
	},
) => {
	utils.sheet_add_aoa(wsSchema, [[], [], ...decreasingSchema.headers], {
		origin: -1,
	});
	utils.sheet_add_json(wsSchema, decreasingSchema.schema, {
		skipHeader: true,
		origin: -1,
	});
};

/**
 * Exports an exemple of the administration schema xlsx file that will be
 * generated and sent to the pharmacy. Triggers a file download.
 * @param patientInfos Patient information.
 * @param physicianInfos Physician information.
 * @param nof1PhysicianInfos Nof1 physician information.
 * @param adminSchema Substances administration schema & header.
 * @param substancesRecap Recapitulation of dosages and amounts of substances.
 * @param comments Comments for the header.
 * @param decreasingSchema Substances decreasing dosage schema & header.
 */
export const pharmaXlsx = async (
	patientInfos: string[][],
	physicianInfos: string[][],
	nof1PhysicianInfos: string[][],
	adminSchema: {
		headers: string[][];
		schema: XlsxSchema;
	},
	substancesRecap: (string | number)[][][],
	comments: string[],
	decreasingSchema: {
		headers: string[][];
		schema: XlsxSchema;
	},
) => {
	const filename = 'Administration_schema_exemple.xlsx';
	const workbook = utils.book_new();
	workbook.Props = {
		Title: filename,
		CreatedDate: new Date(),
	};

	const wsInfoParticipants = wsParticipants(
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
	);
	utils.book_append_sheet(workbook, wsInfoParticipants, 'Participants');

	const lastHeader = adminSchema.headers[adminSchema.headers.length - 1];

	const wsSchema = wsAdministrationSchema(
		adminSchema.headers,
		lastHeader,
		adminSchema.schema,
		comments,
	);

	// add administration schema recap data to an offset position
	let offset = 0;
	substancesRecap.forEach((recap) => {
		utils.sheet_add_aoa(wsSchema, [[], ...recap], {
			origin: { r: 1 + offset, c: lastHeader.length + 1 },
		});
		offset += recap.length + 1;
	});

	if (decreasingSchema.schema.length > 0) {
		addDecreasingSchema(wsSchema, decreasingSchema);
	}

	utils.book_append_sheet(workbook, wsSchema, 'Administration schema');

	writeFileXLSX(workbook, filename);
};
