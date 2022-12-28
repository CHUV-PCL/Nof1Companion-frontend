import { Nof1Test } from '../../../entities/nof1Test';
import { apiCall, apiGet2 } from './common';

/**
 * Retrieve the N-of-1 tests from the list of ids provided.
 * @param token JWT API authorization token.
 * @param body List of test ids.
 * @returns An object with the status of the request and the response.
 */
export const listOfTests = (token: string, body: { ids: string[] }) => {
	return apiCall(token, body, 'POST', '/nof1-tests/list');
};

/**
 * Find a N-of-1 test by its id.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @returns The result of the request.
 */
export const findNof1TestById = (token: string, id: string) => {
	return apiGet2(token, '/nof1-tests', `/${id}`);
};

/**
 * Generic API request for N-of-1 test endpoints.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
const apiNof1Test = (
	token: string,
	body: Nof1Test | Partial<Nof1Test> | undefined,
	method: string,
	param: string = '',
) => {
	return apiCall(token, body, method, '/nof1-tests', param);
};

/**
 * Create a N-of-1 test.
 * @param token JWT API authorization token.
 * @param body N-of-1 test.
 * @returns An object with the status of the request and the response.
 */
export const createNof1Test = (token: string, body: Nof1Test) => {
	return apiNof1Test(token, body, 'POST');
};

/**
 * Update a N-of-1 test.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @param body Elements of the N-of-1 test to update.
 * @returns An object with the status of the request and the response.
 */
export const updateNof1Test = (
	token: string,
	id: string,
	body: Partial<Nof1Test>,
) => {
	return apiNof1Test(token, body, 'PATCH', `/${id}`);
};

/**
 * Delete a N-of-1 test.
 * @param token JWT API authorization token.
 * @param id Id of the test.
 * @returns An object with the status of the request and the response.
 */
export const deleteNof1Test = (token: string, id: string) => {
	return apiNof1Test(token, undefined, 'DELETE', `/${id}`);
};
