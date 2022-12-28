import { Patient } from '../../../entities/people';
import { apiCall, apiGet } from './common';

/**
 * Format API data to a Patient object.
 * @param data Data to format.
 * @returns A patient object.
 */
const toPatient = (data: any): Patient => {
	return {
		_id: data._id,
		lastname: data.lastname,
		firstname: data.firstname,
		address: {
			street: data.address.street,
			zip: data.address.zip,
			city: data.address.city,
			country: data.address.country,
		},
		phone: data.phone,
		email: data.email,
		birthYear: data.birthYear,
		insurance: data.insurance,
		insuranceNb: data.insuranceNb,
	};
};

/**
 * Generic API request for patients endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiPatients = (
	token: string,
	body: Patient,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/patients', param);
};

/**
 * Create a patient.
 * @param token JWT API authorization token.
 * @param body Patient.
 * @returns An object with the status of the request and the response.
 */
export const createPatient = (token: string, body: Patient) => {
	return apiPatients(token, body, 'POST');
};

/**
 * Update a patient.
 * @param token JWT API authorization token.
 * @param id Id of the patient.
 * @param body Updated patient.
 * @returns An object with the status of the request and the response.
 */
export const updatePatient = (token: string, id: string, body: Patient) => {
	return apiPatients(token, body, 'PATCH', `/${id}`);
};

/**
 * Find a patient by email.
 * @param token JWT API authorization token.
 * @param email Email of the patient.
 * @returns A patient object or null if not found.
 */
export const findPatient = async (token: string, email: string) => {
	const { response } = await apiGet(token, '/patients/find/', email);
	return response ? toPatient(response) : null;
};
