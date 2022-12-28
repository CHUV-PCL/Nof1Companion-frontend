import { Posology, PosologyDay } from './posology';

export interface Substance {
	[key: string]: string | Posology | PosologyDay[] | undefined;
	name: string;
	abbreviation: string;
	unit: string;
	posology?: Posology;
	decreasingDosage?: PosologyDay[];
}

export const emptySubstance = {
	name: '',
	abbreviation: '',
	unit: '',
};
