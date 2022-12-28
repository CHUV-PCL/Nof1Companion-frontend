export interface IClinicalInfo {
	sex: string;
	age: string;
	weight: string;
	height: string;
	indication: string;
	otherDiag: string;
	drugs: string;
	otherDrugs: string;
	purpose: {
		efficacy: boolean;
		sideEffects: boolean;
		deprescription: boolean;
		dosage: boolean;
		drugsChoice: boolean;
		genericSubstitutions: boolean;
		other: boolean;
	};
}

export const defaultClinicalInfo = () => {
	return {
		sex: '',
		age: '',
		weight: '',
		height: '',
		indication: '',
		otherDiag: '',
		drugs: '',
		otherDrugs: '',
		purpose: {
			efficacy: false,
			sideEffects: false,
			deprescription: false,
			dosage: false,
			drugsChoice: false,
			genericSubstitutions: false,
			other: false,
		},
	};
};
