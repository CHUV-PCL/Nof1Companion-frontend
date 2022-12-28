import { Nof1Data, Nof1DataUpdate } from '../../../entities/nof1Data';
import { apiCall, apiGet } from './common';

/**
 * Generic API request for N-of-1 patient's health variables data endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiNof1Data = (
	token: string,
	body: Partial<Nof1Data>,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/nof1-data', param);
};

/**
 * Create a N-of-1 data.
 * @param token JWT API authorization token.
 * @param body N-of-1 data.
 * @returns An object with the status of the request and the response.
 */
export const createNof1Data = (token: string, body: Nof1Data) => {
	return apiNof1Data(token, body, 'POST');
};

/**
 * Update a N-of-1 data.
 * @param token JWT API authorization token.
 * @param testId Id of the N-of-1 test which is concerned.
 * @param body Data to update.
 * @returns An object with the status of the request and the response.
 */
export const updateNof1Data = (
	token: string,
	testId: string,
	body: Partial<Nof1Data>,
) => {
	return apiNof1Data(token, body, 'PATCH', `/${testId}`);
};

/**
 * Retrieves a N-of-1 test data by its id.
 * @param token JWT API authorization token.
 * @param testId Id of the test.
 * @returns The response of the request.
 */
export const findNof1Data = (token: string, testId: string) => {
	return apiGet(token, '/nof1-data', `/${testId}`);
};

/**
 * Retrieves a N-of-1 test and its health variables data.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @returns Promise<{
 * success: boolean;
 * response: {test: Nof1Test, data: TestData | undefined};
 * }>
 * A promise indicating the request status and the N-of-1 test and
 * its associated health variables data if any.
 */
export const getPatientData = async (token: string, id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/nof1-data/patient/${id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const res = await response.json();
	return { success: response.ok, response: res };
};

/**
 * Generic API request for N-of-1 patient's health variables data endpoints.
 * Requests from the patient dedicated page.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const patientApiCall = async (
	token: string,
	body: Partial<Nof1Data>,
	method: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/nof1-data/patient${param}`,
		{
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		},
	);
	const result = await response.json();
	return { success: response.ok, response: result };
};

/**
 * Update a N-of-1 data.
 * @param token JWT API authorization token.
 * @param testId Id of the N-of-1 test which is concerned.
 * @param body Data to update.
 * @returns An object with the status of the request and the response.
 */
export const patientDataUpdate = (
	token: string,
	testId: string,
	body: Nof1DataUpdate,
) => {
	return patientApiCall(token, body, 'PATCH', `/${testId}`);
};
