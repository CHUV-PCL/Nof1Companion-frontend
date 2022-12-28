export type PosologyDay = {
	day: number;
	morning: number;
	morningFraction: number;
	noon: number;
	noonFraction: number;
	evening: number;
	eveningFraction: number;
	night: number;
	nightFraction: number;
};

export type Posology = {
	posology: PosologyDay[];
	repeatLast: boolean;
};

export type SubstancePosologies = {
	substance: string;
	unit: string;
	posologies: Posology[];
};

/**
 * Returns a default Posology object.
 * @param nbRows Number of days for the posology.
 * @returns A default Posology object.
 */
export const initialPosology = (nbRows: number): Posology => {
	const rows: PosologyDay[] = [];
	const defaultPos = {
		morning: 0,
		morningFraction: 0,
		noon: 0,
		noonFraction: 0,
		evening: 0,
		eveningFraction: 0,
		night: 0,
		nightFraction: 0,
	};
	for (let i = 1; i <= nbRows; i++) {
		rows.push({ day: i, ...defaultPos });
	}
	return {
		posology: rows,
		repeatLast: false,
	};
};
