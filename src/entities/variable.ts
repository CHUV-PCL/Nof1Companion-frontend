export interface Variable {
	name: string;
	type: VariableType;
	desc: string;
	unit?: string;
	min?: string | number;
	max?: string | number;
	values?: string;
  skippedRunInDays?: number;
}

export enum VariableType {
	Text = 'Text',
	VAS = 'VAS',
	Binary = 'Binary',
	Numeric = 'Numeric',
	Qualitative = 'Qualitative',
}
