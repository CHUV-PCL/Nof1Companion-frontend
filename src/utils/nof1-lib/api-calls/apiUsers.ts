import { apiCall } from './common';

/**
 * Checks if a user exists.
 * @param email User Email.
 * @returns A user if found, otherwise null.
 */
export const userExists = async (
	email: string,
): Promise<{
	success: boolean;
	exists: boolean;
}> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${email}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
	const res = await response.json();
	return { success: response.ok, exists: res.userExists };
};

/**
 * Updates a user email.
 * @param token JWT API authorization token.
 * @param body Object with the current email and the new one.
 * @returns An object with the status of the request and the response.
 */
export const updateUserEmail = (
	token: string,
	body: { email: string; newEmail: string },
) => {
	return apiCall(token, body, 'PATCH', '/users');
};

/**
 * Changes a user's password.
 * @param token JWT API authorization token.
 * @param body Object with the user id and new password.
 * @returns An object indicating the success and the response.
 */
export const changePassword = (
	token: string,
	body: { id: string; newPwd: string },
) => {
	return apiCall(token, body, 'PATCH', '/users/reset-password');
};
