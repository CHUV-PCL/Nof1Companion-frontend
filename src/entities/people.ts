export interface PersonCommon {
	_id?: string;
	lastname: string;
	firstname: string;
	address: {
		street: string;
		zip: string;
		city: string;
		country: string;
	};
	phone: string;
	email: string;
}

export interface Patient extends PersonCommon {
	birthYear: string;
	insurance: string;
	insuranceNb: string;
}

export interface Physician extends PersonCommon {
	institution: string;
	tests?: string[];
}

/**
 * @returns A Physician object with default values.
 */
export const defaultPhysician = (): Physician => {
	return {
		lastname: '',
		firstname: '',
		address: {
			street: '',
			zip: '',
			city: '',
			country: '',
		},
		phone: '',
		email: '',
		institution: '',
	};
};

/**
 * @returns A Patient object with default values.
 */
export const defaultPatient = (): Patient => {
	return {
		lastname: '',
		firstname: '',
		address: {
			street: '',
			zip: '',
			city: '',
			country: '',
		},
		phone: '',
		email: '',
		birthYear: '',
		insurance: '',
		insuranceNb: '',
	};
};

export interface Pharmacy {
	name: string;
  email: string;
  phone: string;
	address: {
		street: string;
		zip: string;
		city: string;
		country: string;
	};
}

/**
 * @returns A Physician object with default values.
 */
export const defaultPharmacy = (): Pharmacy => {
	return {
		name: '',
    email: '',
    phone: '',
		address: {
			street: '',
			zip: '',
			city: '',
			country: '',
		},
	};
};