import { TestData } from '../entities/nof1Data';
import { Nof1Test } from '../entities/nof1Test';
import { Substance } from '../entities/substance';
import { RandomStrategy } from './nof1-lib/randomizationStrategy';
const { jStat } = require('jstat');

export enum AnalyseType {
	NaiveANOVA = 'NaiveANOVA',
	CycleANOVA = 'CycleANOVA',
	ANCOVAautoregr = 'ANCOVAautoregr',
}

/**
 * Creates an array of n length, filled with 0.
 * @param n Length.
 * @returns An array of n length, filled with 0.
 */
const zeroArray = (n: number) => Array<number>(n).fill(0);

/**
 * Creates a matrix of row x col dimension, filled with 0.
 * @param row Number of rows.
 * @param col Number of columns.
 * @returns A matrix of row x col dimension, filled with 0.
 */
const zeroMatrix = (row: number, col: number) =>
	Array<number>(row)
		.fill(0)
		.map((_) => Array<number>(col).fill(0));

/**
 * Helper method to calculate several common variables for
 * the different statistical analysis.
 * @param substances Array of substances.
 * @param d Variables data of the N-of-1 test.
 * @param variable Variable to analyse.
 * @param periodLen Period duration.
 * @returns The substance index, the variable's value and a boolean
 * indicating if the value should be considered for the analysis.
 */
const helper = (
	substances: Substance[],
	d: TestData[number],
	variable: { name: string; skippedRunInDays: number },
	periodLen: number,
) => {
	const subIdx = substances.findIndex((s) => s.name === d.substance);
	const varToAnalyze = d.data.find((v) => v.variableName === variable.name)!;
	const obs = varToAnalyze.value === '' ? NaN : Number(varToAnalyze.value);
	const include = (d.day - 1) % periodLen >= variable.skippedRunInDays!;
	return { subIdx, obs, include };
};

/**
 * Calculates the statistical p-value of a F value.
 * @param F F value.
 * @param df1 Degree of freedom 1.
 * @param df2 Degree of freedom 2.
 * @returns The statistical p-value of a F value.
 */
const Fdistrib = (F: number, df1: number, df2: number) => {
	return 1 - jStat.centralF.cdf(F, df1, df2);
};

export interface Stats {
	treatment: {
		effect: number[];
		SS: number;
		DF: number;
		MS: number;
		F: number;
		P: number;
	};
	residual: {
		SS: number;
		DF: number;
		MS: number;
	};
	total: {
		mean: number;
		SS: number;
		DF: number;
		MS: number;
	};
	cycle?: {
		SS: number;
		DF: number;
		MS: number;
		F: number;
		P: number;
	};
	treatmentCycle?: {
		SS: number;
		DF: number;
		MS: number;
	};
	autoregr?: {
		SS: number;
		DF: number;
		MS: number;
		F: number;
		P: number;
	};
	meta?: {
		slope: number;
		intercept: number;
		corr: number;
	};
}

/**
 * Performs the appropriate statistical analysis according to
 * the given type of analysis.
 * @param typeOfAnalysis Type of analysis to perform.
 * @param variable Variable to analyse.
 * @param test N-of-1 test.
 * @param testData N-of-1 test's data.
 * @returns The statistical analysis.
 * @throws An Error when selecting the cycle ANOVA and the randomization strategy
 * chosen is not the permutation strategy or the custom strategy (which should
 * be consistent with the permutation strategy).
 */
export const anova = (
	typeOfAnalysis: AnalyseType,
	variable: { name: string; skippedRunInDays: number },
	test: Nof1Test,
	testData: TestData,
): Stats => {
	switch (typeOfAnalysis) {
		case AnalyseType.NaiveANOVA:
			return naiveANOVA(test.substances, test.periodLen, testData, variable);
		case AnalyseType.CycleANOVA:
			if (
				test.randomization.strategy !== RandomStrategy.Permutations &&
				test.randomization.strategy !== RandomStrategy.Custom
			)
				throw Error('Not allowed with the randomization strategy chosen');
			return cycleANOVA(
				test.substances,
				test.periodLen,
				test.nbPeriods,
				testData,
				variable,
			);
		case AnalyseType.ANCOVAautoregr:
			return autoregrANCOVA(
				test.substances,
				test.periodLen,
				testData,
				variable,
			);
	}
};

/**
 * Performs a naive ANOVA analysis.
 * @param substances Array of substances.
 * @param periodLen Period duration.
 * @param data N-of-1 test's data.
 * @param variable Variable to analyse.
 * @returns The statistical analysis values.
 */
const naiveANOVA = (
	substances: Substance[],
	periodLen: number,
	data: TestData,
	variable: { name: string; skippedRunInDays: number },
) => {
	const nbSub = substances.length;
	let n = 0,
		sum = 0,
		ss = 0,
		treatmentSS = 0,
		residualSS = 0;
	const treatN = zeroArray(nbSub),
		treatSum = zeroArray(nbSub),
		treatSS = zeroArray(nbSub),
		treatM = zeroArray(nbSub);

	data.forEach((d) => {
		const { subIdx, obs, include } = helper(substances, d, variable, periodLen);

		if (include && !isNaN(obs)) {
			n += 1;
			sum += obs;
			ss += obs ** 2;
			treatN[subIdx] += 1;
			treatSum[subIdx] += obs;
			treatSS[subIdx] += obs ** 2;
		}
	});

	const grandMean = sum / n;

	for (let i = 0; i < nbSub; ++i) {
		treatM[i] = treatSum[i] / treatN[i];
		treatmentSS = treatmentSS + treatN[i] * (treatM[i] - grandMean) ** 2;
		residualSS = residualSS + treatSS[i] - treatN[i] * treatM[i] ** 2;
	}

	const totalSS = ss - n * grandMean ** 2;
	const totalDf = n - 1;
	const treatmentDf = nbSub - 1;
	const treatmentMS = treatmentSS / treatmentDf;
	const residualDf = totalDf - treatmentDf;
	const residualMS = residualSS / residualDf;
	const F = treatmentMS / residualMS;

	return {
		treatment: {
			effect: treatM,
			SS: treatmentSS,
			DF: treatmentDf,
			MS: treatmentMS,
			F: F,
			P: Fdistrib(F, treatmentDf, residualDf),
		},
		residual: {
			SS: residualSS,
			DF: residualDf,
			MS: residualMS,
		},
		total: {
			mean: grandMean,
			SS: totalSS,
			DF: totalDf,
			MS: totalSS / totalDf,
		},
	};
};

/**
 * Performs a ANOVA with Cycle effect.
 * @param substances Array of substances.
 * @param periodLen Period duration.
 * @param nbPeriods Number of periods.
 * @param data N-of-1 test's data.
 * @param variable Variable to analyse.
 * @returns The statistical analysis values.
 */
const cycleANOVA = (
	substances: Substance[],
	periodLen: number,
	nbPeriods: number,
	data: TestData,
	variable: { name: string; skippedRunInDays: number },
) => {
	const nbSub = substances.length;
	let n = 0,
		sum = 0,
		ss = 0,
		treatmentSS = 0,
		residualSS = 0,
		cycleSS = 0,
		treatmentCycleSS = 0;
	const treatN = zeroArray(nbSub),
		treatSum = zeroArray(nbSub),
		treatSS = zeroArray(nbSub),
		treatM = zeroArray(nbSub),
		nbCycles = Math.ceil(nbPeriods / nbSub),
		cycleDuration = nbSub * periodLen,
		cycN = zeroArray(nbCycles),
		cycSum = zeroArray(nbCycles),
		cycSS = zeroArray(nbCycles),
		cycM = zeroArray(nbCycles),
		treatCycN = zeroMatrix(nbSub, nbCycles),
		treatCycSum = zeroMatrix(nbSub, nbCycles),
		treatCycSS = zeroMatrix(nbSub, nbCycles),
		treatCycM = zeroMatrix(nbSub, nbCycles);

	data.forEach((d) => {
		const { subIdx, obs, include } = helper(substances, d, variable, periodLen);
		const cycle = Math.trunc((d.day - 1) / cycleDuration);

		if (include && !isNaN(obs)) {
			n += 1;
			sum += obs;
			ss += obs ** 2;
			treatN[subIdx] += 1;
			treatSum[subIdx] += obs;
			treatSS[subIdx] += obs ** 2;
			cycN[cycle] += 1;
			cycSum[cycle] += obs;
			cycSS[cycle] += obs ** 2;
			treatCycN[subIdx][cycle] += 1;
			treatCycSum[subIdx][cycle] += obs;
			treatCycSS[subIdx][cycle] += obs ** 2;
		}
	});

	const grandMean = sum / n;
	const totalSS = ss - n * grandMean ** 2;
	const totalDf = n - 1;

	for (let i = 0; i < nbSub; ++i) {
		treatM[i] = treatSum[i] / treatN[i];
		treatmentSS += treatN[i] * (treatM[i] - grandMean) ** 2;
	}

	const treatmentDf = nbSub - 1;
	const treatmentMS = treatmentSS / treatmentDf;

	for (let i = 0; i < nbCycles; ++i) {
		cycM[i] = cycSum[i] / cycN[i];
		cycleSS += cycN[i] * (cycM[i] - grandMean) ** 2;
	}

	const cycleDf = nbCycles - 1;
	const cycleMS = cycleSS / cycleDf;

	for (let i = 0; i < nbSub; ++i) {
		for (let j = 0; j < nbCycles; ++j) {
			treatCycM[i][j] = treatCycSum[i][j] / treatCycN[i][j];
			treatmentCycleSS +=
				treatCycN[i][j] *
				(treatCycM[i][j] - treatM[i] - cycM[j] + grandMean) ** 2;
			residualSS += treatCycSS[i][j] - treatCycN[i][j] * treatCycM[i][j] ** 2;
		}
	}

	const treatmentCycleDf = (nbSub - 1) * (nbCycles - 1);
	const treatmentCycleMS = treatmentCycleSS / treatmentCycleDf;
	const residualDf = totalDf - treatmentDf - cycleDf - treatmentCycleDf;
	const FTreatment = treatmentMS / treatmentCycleMS;
	const FCycle = cycleMS / treatmentCycleMS;

	return {
		treatment: {
			effect: treatM,
			SS: treatmentSS,
			DF: treatmentDf,
			MS: treatmentMS,
			F: FTreatment,
			P: Fdistrib(FTreatment, treatmentDf, treatmentCycleDf),
		},
		cycle: {
			SS: cycleSS,
			DF: cycleDf,
			MS: cycleMS,
			F: FCycle,
			P: Fdistrib(FCycle, cycleDf, treatmentCycleDf),
		},
		treatmentCycle: {
			SS: treatmentCycleSS,
			DF: treatmentCycleDf,
			MS: treatmentCycleMS,
		},
		residual: {
			SS: residualSS,
			DF: residualDf,
			MS: residualSS / residualDf,
		},
		total: {
			mean: grandMean,
			SS: totalSS,
			DF: totalDf,
			MS: totalSS / totalDf,
		},
	};
};

/**
 * Performs an ANCOVA Auto-regression.
 * @param substances Array of substances.
 * @param periodLen Period duration.
 * @param data N-of-1 test's data.
 * @param variable Variable to analyse.
 * @returns The statistical analysis values.
 */
const autoregrANCOVA = (
	substances: Substance[],
	periodLen: number,
	data: TestData,
	variable: { name: string; skippedRunInDays: number },
) => {
	const nbSub = substances.length;
	let n = 0,
		sumX = 0,
		sumY = 0,
		sumX2 = 0,
		sumY2 = 0,
		sumXY = 0,
		ssXTreat = 0,
		ssYTreat = 0,
		ssXSlope = 0;
	const treatN = zeroArray(nbSub),
		treatSumX = zeroArray(nbSub),
		treatSumX2 = zeroArray(nbSub),
		treatSumY2 = zeroArray(nbSub),
		treatSumXY = zeroArray(nbSub),
		treatSumY = zeroArray(nbSub),
		treatMX = zeroArray(nbSub),
		treatSSX = zeroArray(nbSub),
		treatMY = zeroArray(nbSub),
		treatSSY = zeroArray(nbSub),
		treatEffect = zeroArray(nbSub),
		treatSlope = zeroArray(nbSub);

	let isPrev = false;
	let prev = NaN;
	data.forEach((d) => {
		const { subIdx, obs, include } = helper(substances, d, variable, periodLen);

		if (include && !isNaN(obs) && isPrev && !isNaN(prev)) {
			n += 1;
			sumX += prev;
			sumX2 += prev ** 2;
			sumY += obs;
			sumY2 += obs ** 2;
			sumXY += prev * obs;
			treatN[subIdx] += 1;
			treatSumX[subIdx] += prev;
			treatSumX2[subIdx] += prev ** 2;
			treatSumY[subIdx] += obs;
			treatSumY2[subIdx] += obs ** 2;
			treatSumXY[subIdx] += prev * obs;
		}
		prev = obs;
		if (!isPrev && include) isPrev = true;
		if (isPrev && !include) isPrev = false;
	});

	const meanX = sumX / n;
	const meanY = sumY / n;
	const totalSSX = sumX2 - n * meanX ** 2;
	const totalSSY = sumY2 - n * meanY ** 2;
	const totalDf = n - 1;
	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);

	for (let i = 0; i < nbSub; ++i) {
		treatMX[i] = treatSumX[i] / treatN[i];
		treatMY[i] = treatSumY[i] / treatN[i];
		treatSSX[i] = treatSumX2[i] - treatN[i] * treatMX[i] ** 2;
		treatSSY[i] = treatSumY2[i] - treatN[i] * treatMY[i] ** 2;
		ssXTreat += treatSSX[i];
		ssYTreat += treatSSY[i];
		treatSlope[i] =
			(treatN[i] * treatSumXY[i] - treatSumX[i] * treatSumY[i]) /
			(treatN[i] * treatSumX2[i] - treatSumX[i] ** 2);
		ssXSlope += treatSlope[i] * treatSSX[i];
	}

	const metaSlope = ssXSlope / ssXTreat;
	const metaIntercept = treatMY[0] - metaSlope * treatMX[0];
	const metaCorr = Math.sqrt((metaSlope * totalSSX) / totalSSY);
	const residualSS = ssYTreat - ssXTreat * metaSlope ** 2;
	const treatmentSS = totalSSY - totalSSX * slope ** 2 - residualSS;
	const autoregrSS = metaSlope * ssXSlope;
	const autoregrDf = 1;
	const treatmentDf = nbSub - 1;
	const residualDf = totalDf - treatmentDf - autoregrDf;

	treatEffect[0] = metaSlope * meanX + metaIntercept;
	for (let i = 1; i < nbSub; ++i) {
		treatEffect[i] =
			treatEffect[0] +
			treatMY[i] -
			treatMY[0] -
			metaSlope * (treatMX[i] - treatMX[0]);
	}

	const treatmentMS = treatmentSS / treatmentDf;
	const autoregrMS = autoregrSS / autoregrDf;
	const residualMS = residualSS / residualDf;
	const FTreatment = treatmentMS / residualMS;
	const FAutoregr = autoregrMS / residualMS;

	return {
		treatment: {
			effect: treatEffect,
			SS: treatmentSS,
			DF: treatmentDf,
			MS: treatmentMS,
			F: FTreatment,
			P: Fdistrib(FTreatment, treatmentDf, residualDf),
		},
		autoregr: {
			SS: autoregrSS,
			DF: autoregrDf,
			MS: autoregrMS,
			F: FAutoregr,
			P: Fdistrib(FAutoregr, autoregrDf, residualDf),
		},
		meta: {
			slope: metaSlope,
			intercept: metaIntercept,
			corr: metaCorr,
		},
		residual: {
			SS: residualSS,
			DF: residualDf,
			MS: residualMS,
		},
		total: {
			mean: meanY,
			SS: totalSSY,
			DF: totalDf,
			MS: totalSSY / totalDf,
		},
	};
};

/**
 * Checks if the statistical analysis is valid
 * (does not contains any NaN value due to missing data).
 * @param stats Statistical analysis values.
 * @returns True if valid, false otherwise.
 */
export const isAnalysisValid = (stats: Stats) => {
	const { effect, ...wOutEffect } = stats.treatment;
	const s = { ...stats, treatment: wOutEffect };
	const allValues = Object.values(s).flatMap((o) => Object.values(o));
	return (
		allValues.every((v: number) => !isNaN(v)) && effect.every((v) => !isNaN(v))
	);
};
