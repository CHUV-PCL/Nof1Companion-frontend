// KEY for session storage
export const USER_CTX_KEY = 'userCtx';

// REGEX
export const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
export const oneUpperRegex = new RegExp('(?=.*[A-Z])');
export const oneLowerRegex = new RegExp('(?=.*[a-z])');
export const oneDigitOrSpecialRegex = new RegExp(
	'((?=.*[0-9])|([^A-Za-z0-9]))',
);
export const noWhiteSpaceRegex = new RegExp(/(?!.*[\s])/);
export const passwordRegex =
	/^((?!.*[\s])(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[^a-zA-Z0-9])).{8,32})$/;
export const numericInputPattern = '^[0-9]$|^[1-9][0-9]*$|^[0-9]+\\.[0-9]+$';
export const numericInputRegex = new RegExp(numericInputPattern);
export const textareaRegex = /^[\w\s,.:;'"\/+?!#%\-()À-ÖØ-öø-ÿ]*$/;
export const alphaRegex = /^[a-zA-Z\s'\-À-ÖØ-öø-ÿ]*$/;
export const smallNumberRange = /^([12])?[0-9]?[0-9]$|^$/;
export const yearRegex = /^[0-9]{4}$/;

// N-of-1 creation
// parameter for randomization strategy
export const maxRepOptions = [1, 2, 3, 4, 5];
// max value for periods length and number of periods
export const maxValue = 100;
// max number of substances allowed in a test
export const maxNbSubstances = 10;

// Token expiration margin, in days.
export const tokenExpMargin = 14;

// Charts colors
export const chartsColors = [
	'#e6194b',
	'#4363d8',
	'#911eb4',
	'#3cb44b',
	'#ffe119',
	'#f58231',
	'#46f0f0',
	'#bcf60c',
	'#f032e6',
	'#aaffc3',
	'#e6beff',
	'#ffd8b1',
	'#000000',
];
