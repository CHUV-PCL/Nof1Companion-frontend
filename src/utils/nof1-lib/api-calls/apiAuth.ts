import { UserContextType } from '../../../context/UserContext';
import { apiGet2, toPhysician } from './common';

/**
 * Authentication API call.
 * @param endpoint Endpoint to reach.
 * @param body Body of the request.
 * @param handleAuth Method handling the result of the API call.
 */
export const authenticate = async (
	endpoint: string,
	body: Object,
	handleAuth: (noError: boolean, user: UserContextType) => void,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	const noError = response.ok;
	let result = await response.json();
	if (noError) {
		result = {
			access_token: result.access_token,
			user: toPhysician(result.user),
		};
	}
	handleAuth(noError, result);
};

/**
 * GET request with credentials. Used for the captcha challenge (and session).
 * @param endpoint API endpoint.
 * @returns The JSON response.
 */
const getWithCredentials = async (endpoint: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
	);
	return await response.json();
};

/**
 * Retrieves the captcha challenge.
 * @returns The captcha svg string.
 */
export const getCaptcha = async (): Promise<string> => {
	const { captchaImg } = await getWithCredentials('/captcha');
	return captchaImg;
};

/**
 * Verifies the captcha challenge.
 * @param captcha User input for the captcha.
 * @returns True if the challenge is valid, false otherwise.
 */
export const verifyCaptcha = async (captcha: string): Promise<boolean> => {
	const { verified } = await getWithCredentials(`/captcha/verify/${captcha}`);
	return verified;
};

/**
 * Checks a token validity.
 * @param token Token.
 * @returns True if the token is valid, false otherwise.
 */
export const checkTokenValidity = async (token: string) => {
	const { success } = await apiGet2(token, '/auth/check-token');
	return success;
};
