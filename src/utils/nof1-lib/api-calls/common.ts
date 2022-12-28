import { Physician } from '../../../entities/people';

/**
 * Generic API GET request.
 * @param token JWT API authorization token.
 * @param endpoint Endpoint to reach.
 * @param param Parameter of the HTTP request.
 * @returns The result of the request.
 */
export const apiGet = async (
	token: string,
	endpoint: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}${param}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return await response.json();
};

/**
 * Generic API GET request.
 * @param token JWT API authorization token.
 * @param endpoint Endpoint to reach.
 * @param param Parameter of the HTTP request.
 * @returns The result of the request.
 */
export const apiGet2 = async (
	token: string,
	endpoint: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}${param}`,
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
 * Generic API request.
 * @param token JWT API authorization token.
 * @param body Body of the request.
 * @param method HTTP method of the request.
 * @param endpoint Endpoint to reach.
 * @param param Parameter of the HTTP request.
 * @returns An object with the status of the request and the response.
 */
export const apiCall = async (
	token: string,
	body: any,
	method: string,
	endpoint: string,
	param: string = '',
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}${param}`,
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
 * Format API data to a Physician object.
 * @param data Data to format.
 * @returns A physician object.
 */
export const toPhysician = (data: any): Physician => {
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
		institution: data.institution,
		tests: data.tests,
	};
};
