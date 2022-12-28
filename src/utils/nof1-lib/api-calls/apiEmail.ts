import { XlsxSchema } from '../../xlsx';
import { apiCall } from './common';

/**
 * Request to send an email, with data to be exported into a XLSX file.
 * @param token JWT API authorization token.
 * @param data Data to be exported.
 * @param msg Email message.
 * @param dest Recipient email.
 * @param subject Email subject.
 * @returns The response object of the request.
 */
export const sendPharmaEmail = async (
	token: string,
	data: {
		patientInfos: string[][];
		physicianInfos: string[][];
		nof1PhysicianInfos: string[][];
		administrationSchema: {
			headers: string[][];
			schema: XlsxSchema;
		};
		substancesRecap: (string | number)[][][];
		comments: string[];
		decreasingSchema: {
			headers: string[][];
			schema: XlsxSchema;
		};
	},
	msg: {
		text: string;
		html: string;
	},
	dest: string,
	subject: string,
): Promise<{
	success: boolean;
	msg: string;
}> => {
	const body = {
		msg,
		dest,
		subject,
		data,
	};
	const { response } = await apiCall(token, body, 'POST', '/mail');
	return response;
};

/**
 * Sends an email to a patient, with an access link for
 * the health variables data form.
 * @param token JWT API authorization token.
 * @param msg Email message in text and HTML format.
 * @param dest Recipient.
 * @param subject Email subject.
 * @param tokenExp Unix date indicating the expiration date of the
 * access token for the health variables data page.
 * @param notBefore Unix date indicating the date of the access token
 * validity for the health variables data page.
 * @returns An object of type { success: boolean, msg: string }.
 */
export const sendPatientEmail = async (
	token: string,
	msg: {
		text: string;
		html: string;
	},
	dest: string,
	subject: string,
	tokenExp: number,
	notBefore: number,
): Promise<{
	success: boolean;
	msg: string;
}> => {
	const body = {
		msg,
		dest,
		subject,
		tokenExp,
		notBefore,
	};
	const { response } = await apiCall(token, body, 'POST', '/mail/patient');
	return response;
};

/**
 * Sends an email to a user, with an access link to reset his password.
 * @param msg Email message in text and HTML format.
 * @param dest Recipient.
 * @param subject Email subject.
 * @returns An object of type { success: boolean, msg: string }.
 */
export const resetPassword = async (
	msg: {
		text: string;
		html: string;
	},
	dest: string,
	subject: string,
): Promise<{
	success: boolean;
	msg: string;
}> => {
	const body = {
		msg,
		dest,
		subject,
	};
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mail/resetPwd`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	const res = await response.json();
	return { success: res.success, msg: res.msg };
};
