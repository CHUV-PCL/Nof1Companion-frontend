import { apiGet2 } from './common';

/**
 * Retrieves an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * @param token JWT API authorization token.
 * @param testId N-of-1 test id.
 * @returns An object containing the xml string.
 */
export const clearXML = async (token: string, testId: string) => {
	return apiGet2(token, '/nof1-data/xml', `/${testId}`);
};

/**
 * Retrieves an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * Identifying information about people involved in the N-of-1 test is hashed.
 * @param token JWT API authorization token.
 * @param testId N-of-1 test id.
 * @returns An object containing the xml string.
 */
export const anonymousXML = async (token: string, testId: string) => {
	return apiGet2(token, '/nof1-data/xml/anonymous', `/${testId}`);
};

/**
 * Retrieves an XML string representing an XML file, in ODM-XML format,
 * containing all the information about a N-of-1 test and its patient's data.
 * Identifying information about people involved in the N-of-1 test is encrypted.
 * @param token JWT API authorization token.
 * @param testId N-of-1 test id.
 * @returns An object containing the xml string.
 */
export const encryptedXML = async (token: string, testId: string) => {
	return apiGet2(token, '/nof1-data/xml/encrypted', `/${testId}`);
};
