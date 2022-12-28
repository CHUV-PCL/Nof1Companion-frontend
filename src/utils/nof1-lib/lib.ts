import dayjs from 'dayjs';
import { SubstancePosologies } from '../../entities/posology';
import { Substance } from '../../entities/substance';
import {
	AdministrationSchema,
	Nof1Test,
	TestStatus,
} from '../../entities/nof1Test';
import { TestData } from '../../entities/nof1Data';
import { Patient, PersonCommon, Physician } from '../../entities/people';
import {
	CustomSequence,
	getRandomElemFromArray,
	MaxRep,
	Permutation,
	Randomization,
	RandomizationStrategy,
	RandomStrategy,
} from './randomizationStrategy';
import { sendPharmaEmail } from './api-calls/apiEmail';
import { pharmaXlsx, formatSchema, substancesRecap } from '../xlsx';

/**
 * Selects a random posology from all the substance's posologies.
 * @param allPosologies Array of substances and their posologies.
 * @param substance Substance's name.
 * @returns An array containing the selected posology.
 */
export const selectRandomPosology = (
	allPosologies: SubstancePosologies[],
	substance: string,
) => {
	const posologies = allPosologies.find(
		(p) => p.substance === substance,
	)!.posologies;
	return getRandomElemFromArray(posologies);
};

/**
 * Generates a random administration sequence for all substances of the
 * N-of-1 test, according to the randomization strategy (for the number
 * of periods). The resulting array contains the substances abbreviations.
 * @param substances Substances of the N-of-1 test.
 * @param randomization Randomization strategy chosen.
 * @param nbPeriods Number of periods during the test.
 * @returns A randomized administration sequence for the substances.
 */
export const generateSequence = (
	substances: Substance[],
	randomization: RandomizationStrategy,
	nbPeriods: number,
) => {
	const substancesAbbrev = substances.map((s) => s.abbreviation);
	let r: Randomization;
	switch (randomization.strategy) {
		case RandomStrategy.MaxRep:
			r = new MaxRep(randomization.maxRep!);
			break;
		case RandomStrategy.Custom:
			r = new CustomSequence(randomization.predefinedSeq!);
			break;
		case RandomStrategy.Permutations:
		default:
			r = new Permutation();
	}
	return r.randomize(substancesAbbrev, nbPeriods);
};

/**
 * Generates the administration schema of substances for the N-of-1 test,
 * according to the selected substances, their posologies and the
 * substances administration sequence.
 * @param substances Substances of the test.
 * @param seq Substances administration sequence.
 * @param periodLen Period Length.
 * @param nbPeriods Number of periods.
 * @returns An array containing the administration schema for every day of
 * the N-of-1 test.
 */
export const generateAdministrationSchema = (
	substances: Substance[],
	seq: string[],
	periodLen: number,
	nbPeriods: number,
): AdministrationSchema => {
	const result: AdministrationSchema = [];
	let dateCounter = 0;
	for (let i = 0; i < nbPeriods; i++) {
		const abbrev = seq[i];
		const { name, unit, posology } = substances.find(
			(s) => s.abbreviation === abbrev,
		)!;
		// if a substance is repeated and repeatLast option is true,
		// we repeat the last posology.
		if (
			i > 0 &&
			result.slice().pop()?.substance === name &&
			posology!.repeatLast
		) {
			const prev = result.slice().pop()!;
			for (let j = 0; j < periodLen; j++) {
				result.push({
					...prev,
					day: dateCounter++,
				});
			}
		} else {
			for (let j = 0; j < periodLen; j++) {
				result.push({
					day: dateCounter++,
					substance: name,
					morning: posology!.posology[j].morning,
					morningFraction: posology!.posology[j].morningFraction,
					noon: posology!.posology[j].noon,
					noonFraction: posology!.posology[j].noonFraction,
					evening: posology!.posology[j].evening,
					eveningFraction: posology!.posology[j].eveningFraction,
					night: posology!.posology[j].night,
					nightFraction: posology!.posology[j].nightFraction,
					unit: unit,
				});
			}
		}
	}
	return result;
};

/**
 * Generates the decreasing dosage administration schema of substances.
 * @param periodLen Period Length.
 * @param nbPeriods Number of periods.
 * @param schema Substances administration schema.
 * @param substances Substances of the test.
 * @returns An array containing the decreasing dosage administration
 * schema of substances.
 */
export const generateDecreasingSchema = (
	periodLen: number,
	nbPeriods: number,
	schema: AdministrationSchema,
	substances: Substance[],
) => {
	const result: AdministrationSchema = [];
	for (let i = periodLen; i < nbPeriods * periodLen; i += periodLen) {
		const prevSub = schema[i - 1].substance;
		if (schema[i].substance !== prevSub) {
			for (let j = 0; j < periodLen; j++) {
				const decreasingDosage = substances.find(
					(s) => s.name === prevSub,
				)!.decreasingDosage;
				if (decreasingDosage) {
					result.push({
						day: schema[i].day + j,
						substance: prevSub,
						unit: schema[i - 1].unit,
						morning: decreasingDosage[j].morning,
						morningFraction: decreasingDosage[j].morningFraction,
						noon: decreasingDosage[j].noon,
						noonFraction: decreasingDosage[j].noonFraction,
						evening: decreasingDosage[j].evening,
						eveningFraction: decreasingDosage[j].eveningFraction,
						night: decreasingDosage[j].night,
						nightFraction: decreasingDosage[j].nightFraction,
					});
				}
			}
		}
	}
	return result;
};

/**
 * Generates an example of the xlsx file sent to the pharmacy.
 * The file is different from the one sent to the pharmacy.
 * @param test Nof1 test.
 * @param xlsxData Data to display into the xlsx file.
 * @returns Triggers the xlsx file download.
 */
export const generateXlsxSchemaExample = (
	test: Nof1Test,
	xlsxData: {
		patientInfos: string[][];
		physicianInfos: string[][];
		nof1PhysicianInfos: string[][];
		schemaHeaders: string[][];
		comments: string[];
		recapTxt: { qty: string; totalDose: string; unitDose: string };
		decreasingSchemaInfo: string[];
	},
) => {
	const substances = test.substances.map((s) => {
		s.posology = selectRandomPosology(test.posologies, s.name);
		return s;
	});
	const substancesSequence = generateSequence(
		substances,
		test.randomization,
		test.nbPeriods,
	);
	const administrationSchema = generateAdministrationSchema(
		substances,
		substancesSequence,
		test.periodLen,
		test.nbPeriods,
	);
	const decreasingSchema = generateDecreasingSchema(
		test.periodLen,
		test.nbPeriods,
		administrationSchema,
		substances,
	);
	const xlsSchema = formatSchema(administrationSchema);
	const xlsDecreasingSchema = formatSchema(decreasingSchema);
	const recap = substancesRecap(
		substances,
		xlsSchema,
		xlsDecreasingSchema,
		xlsxData.recapTxt,
	);
	return pharmaXlsx(
		xlsxData.patientInfos,
		xlsxData.physicianInfos,
		xlsxData.nof1PhysicianInfos,
		{ schema: xlsSchema, headers: xlsxData.schemaHeaders },
		recap,
		xlsxData.comments,
		{
			schema: xlsDecreasingSchema,
			headers: [xlsxData.decreasingSchemaInfo, ...xlsxData.schemaHeaders],
		},
	);
};

/**
 * Format the patient's health variables data, to render it into a table.
 * @param data Patient health variables data.
 * @param showPeriodQuestions Indicates whether end-of-period questions
 * should be displayed.
 * @returns The formatted data (as an array of string).
 */
export const formatPatientDataToTable = (
	data: TestData,
	showPeriodQuestions: boolean,
): string[][] => {
	return data.map((d) => {
		const row = [new Date(d.date).toLocaleDateString(), d.substance];
		d.data.forEach((v) => row.push(v.value));
		if (showPeriodQuestions)
			row.push(d.supposition ?? '', d.optimal ?? '', d.endPeriodRemark ?? '');
		return row;
	});
};

/**
 * Generate and return the default data for the N-of-1 test.
 * @param test N-of-1 test.
 * @returns The default test data array.
 */
export const defaultData = (test: Nof1Test): TestData => {
	let totalDuration = test.nbPeriods * test.periodLen;
	if (test.status === TestStatus.Interrupted) {
		totalDuration =
			dayjs(test.endingDate).diff(dayjs(test.beginningDate), 'day') + 1;
	}
	const data: TestData = [];
	for (let i = 0; i < totalDuration; i++) {
		data.push({
			day: i + 1,
			date: dayjs(test.beginningDate).add(i, 'day').toDate(),
			substance: test.administrationSchema![i].substance,
			data: test.monitoredVariables.map((variable) => ({
				variableName: variable.name,
				value: '',
			})),
		});
	}
	return data;
};

/**
 * Wrapper to email the pharmacy with all the information.
 * @param test Nof1 test.
 * @param accessToken User access token for API call.
 * @param patientInfos Patient information.
 * @param physicianInfos Physician information.
 * @param nof1PhysicianInfos Nof1 physician information.
 * @param schemaHeaders Substances administration schema headers.
 * @param comments Comments for the xslx header.
 * @param recapTxt Substances recapitulation texts.
 * @param decreasingSchemaInfo Information/title for the decreasing dosage schema.
 * @param msg Email message.
 * @param emailSubject Email subject.
 * @returns The API response to an email request.
 */
export const sendPharmaEmailWrapper = (
	test: Nof1Test,
	accessToken: string,
	patientInfos: string[][],
	physicianInfos: string[][],
	nof1PhysicianInfos: string[][],
	schemaHeaders: string[][],
	comments: string[],
	recapTxt: { qty: string; totalDose: string; unitDose: string },
	decreasingSchemaInfo: string[],
	msg: {
		text: string;
		html: string;
	},
	emailSubject: string,
) => {
	const xlsxSchema = formatSchema(test.administrationSchema!);
	const xlsDecreasingSchema = formatSchema(
		generateDecreasingSchema(
			test.periodLen,
			test.nbPeriods,
			test.administrationSchema!,
			test.substances,
		),
	);
	return sendPharmaEmail(
		accessToken,
		{
			patientInfos,
			physicianInfos,
			nof1PhysicianInfos,
			administrationSchema: { headers: schemaHeaders, schema: xlsxSchema },
			substancesRecap: substancesRecap(
				test.substances,
				xlsxSchema,
				xlsDecreasingSchema,
				recapTxt,
			),
			comments,
			decreasingSchema: {
				headers: [decreasingSchemaInfo, ...schemaHeaders],
				schema: xlsDecreasingSchema,
			},
		},
		msg,
		test.participants.pharmacy.email,
		emailSubject,
	);
};

/**
 * Checks equality of two person's information.
 * @param p1 Person 1.
 * @param p2 Person 2.
 * @returns True if equal, false otherwise.
 */
const isPersonEqual = (p1: PersonCommon, p2: PersonCommon) => {
	return (
		p1.lastname === p2.lastname &&
		p1.firstname === p2.firstname &&
		p1.email === p2.email &&
		p1.phone === p2.phone &&
		p1.address.street === p2.address.street &&
		p1.address.city === p2.address.city &&
		p1.address.zip === p2.address.zip &&
		p1.address.country === p2.address.country
	);
};

/**
 * Checks equality of two physician's information.
 * @param p1 Person 1.
 * @param p2 Person 2.
 * @returns True if equal, false otherwise.
 */
export const isPhysicianInfoEqual = (p1: Physician, p2: Physician) => {
	return isPersonEqual(p1, p2) && p1.institution === p2.institution;
};

/**
 * Checks equality of two patient's information.
 * @param p1 Person 1.
 * @param p2 Person 2.
 * @returns True if equal, false otherwise.
 */
export const isPatientInfoEqual = (p1: Patient, p2: Patient) => {
	return (
		isPersonEqual(p1, p2) &&
		p1.insurance === p2.insurance &&
		p1.insuranceNb === p2.insuranceNb
	);
};
