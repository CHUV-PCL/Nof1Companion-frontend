import { Physician } from '../../../entities/people';
import { apiCall, apiGet, toPhysician } from './common';

/**
 * Get the user with the id passed in parameter.
 * @param token JWT API authorization token.
 * @param id Id of the user to retrieve.
 * @returns An object with the status of the request and the response.
 */
export const getUser = async (token: string, id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/physicians/${id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	const success = response.ok;
	const result = await response.json();
	if (success) {
		return {
			success,
			response: toPhysician(result.response),
		};
	}
	return { success, response: result };
};

/**
 * Generic API request for physicians endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiPhysicians = (
	token: string,
	body: Partial<Physician>,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/physicians', param);
};

/**
 * Create a physician.
 * @param token JWT API authorization token.
 * @param body Physician.
 * @returns An object with the status of the request and the response.
 */
export const createPhysician = (token: string, body: Physician) => {
	return apiPhysicians(token, body, 'POST');
};

/**
 * Update a physician.
 * @param token JWT API authorization token.
 * @param id Id of the physician.
 * @param body Elements of the physician to update.
 * @returns An object with the status of the request and the response.
 */
export const updatePhysician = (
	token: string,
	id: string,
	body: Partial<Physician>,
) => {
	return apiPhysicians(token, body, 'PATCH', `/${id}`);
};

/**
 * Find a physician by email.
 * @param token JWT API authorization token.
 * @param email Email of the physician.
 * @returns A Physician object or null if not found.
 */
export const findPhysician = async (token: string, email: string) => {
	const { response } = await apiGet(token, '/physicians/find/', email);
	return response ? toPhysician(response) : null;
};
