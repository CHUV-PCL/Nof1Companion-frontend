import { RandomizationStrategy } from '../utils/nof1-lib/randomizationStrategy';
import { AnalyseType } from '../utils/statistics';
import { IClinicalInfo } from './clinicalInfo';
import { Patient, Pharmacy, Physician } from './people';
import { PosologyDay, SubstancePosologies } from './posology';
import { Substance } from './substance';
import { Variable } from './variable';

export enum TestStatus {
	Draft = 'draft',
	Preparation = 'preparation',
	Ready = 'ready',
	Ongoing = 'ongoing',
	Ended = 'ended',
	Interrupted = 'interrupted',
}

// Participants (patient & physicians) information is recorded at
// the moment "T" of the test creation. No dynamic link with patients
// or physicians collections in DB. To ensure traceability.
export interface Nof1Test {
	uid?: string;
	participants: IParticipants;
	clinicalInfo: IClinicalInfo;
	status: TestStatus;
	nbPeriods: number;
	periodLen: number;
	randomization: RandomizationStrategy;
	beginningDate?: Date;
	endingDate?: Date;
	substancesSequence?: string[];
	administrationSchema?: AdministrationSchema;
	substances: Substance[];
	posologies: SubstancePosologies[];
	monitoredVariables: Variable[];
	statistics: { analysisToPerform: AnalyseType };
	meta_info: {
		creationDate: Date;
		emailSendingDate?: Date;
		showPeriodQuestions: boolean;
	};
}

export interface IParticipants {
	patient: Patient;
	requestingPhysician: Physician;
	attendingPhysician?: Physician;
	nof1Physician: Physician;
	pharmacy: Pharmacy;
}

export type AdministrationSchema = ({
	substance: string;
	unit: string;
} & PosologyDay)[];
