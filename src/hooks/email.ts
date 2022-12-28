import useTranslation from 'next-translate/useTranslation';
import { Patient, Physician } from '../entities/people';

/**
 * Format et returns all necessary information to send by email to the pharmacy.
 * Data are formatted into arrays with headers for futur xlsx export.
 * Headers use the locale of session for translation.
 * @param patient Patient information.
 * @param physician Physician information.
 * @param user User information.
 * @returns An object containing all information needed to be sent.
 */
export const usePharmaEmailInfos = (
	patient: Patient,
	physician: Physician,
	user: Physician,
) => {
	const { t } = useTranslation('common');
	const contact = `${user.lastname} ${user.firstname}`;
	const msg = usePharmaEmailMsg(contact, user.email, user.phone);
	const mergeHeader = [
		'',
		'',
		'',
		t('posology-table.morning'),
		'',
		'',
		t('posology-table.noon'),
		'',
		'',
		t('posology-table.evening'),
		'',
		'',
		t('posology-table.night'),
	];
	const dosage = [
		t('posology-table.dose-w/o-unit'),
		t('posology-table.fraction'),
		t('posology-table.dose-unitary'),
	];
	const schemaHeaders = [
		mergeHeader,
		[
			t('day'),
			t('substance'),
			t('posology-table.unit'),
			...dosage,
			...dosage,
			...dosage,
			...dosage,
		],
	];
	const personHeaders = [
		t('form.firstname'),
		t('form.lastname'),
		t('form.street'),
		t('form.zip'),
		t('form.city'),
		t('form.country'),
		t('form.email'),
		t('form.phone'),
	];
	const patientHeaders = [
		...personHeaders,
		t('form.birth-year'),
		t('form.insurance'),
		t('form.insuranceNb'),
	];
	const patientInfos = [
		[t('createTest:participants.patient')],
		patientHeaders,
		[
			patient.firstname,
			patient.lastname,
			patient.address.street,
			patient.address.zip,
			patient.address.city,
			patient.address.country,
			patient.email,
			patient.phone,
			patient.birthYear,
			patient.insurance,
			patient.insuranceNb,
		],
	];
	const physicianHeaders = [...personHeaders, t('form.institution')];
	const physicianInfos = [
		[t('createTest:participants.requestingPhysician')],
		physicianHeaders,
		[
			physician.firstname,
			physician.lastname,
			physician.address.street,
			physician.address.zip,
			physician.address.city,
			physician.address.country,
			physician.email,
			physician.phone,
			physician.institution,
		],
	];
	const nof1PhysicianInfos = [
		[t('createTest:participants.nof1-physician')],
		physicianHeaders,
		[
			user.firstname,
			user.lastname,
			user.address.street,
			user.address.zip,
			user.address.city,
			user.address.country,
			user.email,
			user.phone,
			user.institution,
		],
	];
	const recapTxt = {
		qty: t('xlsx.sub-recap.qty'),
		totalDose: t('xlsx.sub-recap.total-dose'),
		unitDose: t('xlsx.sub-recap.unit-dose'),
	};
	return {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
		recapTxt,
		comments: [`* ${t('posology-table.fraction-desc')}`],
		emailSubject: t('mail:pharma.subject'),
	};
};

/**
 * Prepare and return the email message to be sent.
 * The message is formatted as text and html.
 * Message use the locale of session for translation.
 * @param contact Full name of the contact.
 * @param contactEmail Email of the contact.
 * @param phone Phone of the contact.
 * @returns An object containing the message as plain text and html.
 */
const usePharmaEmailMsg = (
	contact: string,
	contactEmail: string,
	phone: string,
) => {
	const { t } = useTranslation('mail');
	const warning = t('warning');
	const hello = t('hello');
	const intro = t('pharma.intro');
	const intro1 = t('pharma.intro1');
	const intro2 = t('pharma.intro2');
	const contactInfo = t('pharma.contact');
	const contactName = t('pharma.contact-name', { name: contact });
	const contactEmail2 = t('pharma.contact-email', { email: contactEmail });
	const contactPhone = t('pharma.contact-phone', { phone: phone });
	const greetings = t('pharma.greetings');

	const text = `${warning}

${hello}

${intro}
${intro1}
${intro2}

${contactInfo}
${contactName}
${contactEmail2}
${contactPhone}

${greetings}
`;

	const html = `<p><i>${warning}</i></p>
	<br/>
	<p>${hello}</p>
	<p>
		${intro}<br/>
		${intro1}<br/>
		${intro2}
	</p>
	<p>${contactInfo}</p>
	<p>
		${contactName}<br/>
		${contactEmail2}<br/>
		${contactPhone}
	</p>
	<p>${greetings}</p>
	`;

	return { text, html };
};

/**
 * Prepare and return the email message to be sent.
 * The message is formatted as text and html.
 * Message use the locale of session for translation.
 * @param link URL link to the health logbook.
 * @param nof1Physician Physician's information.
 * @param startDate Test start date.
 * @param endDate Test end date.
 * @returns An object containing the message as plain text and html.
 */
export const usePatientEmailMsg = (
	link: string,
	nof1Physician: Physician,
	startDate: string,
	endDate: string,
) => {
	const { t } = useTranslation('mail');
	const warning = t('warning');
	const hello = t('hello');
	const intro = t('patient.intro');
	const linkInfo = t('patient.link', { startDate, endDate });
	const linkInfo2 = t('patient.link2');
	const contactInfo = t('patient.contact');
	const contactName = t('patient.contact-name', {
		name: `${nof1Physician.lastname} ${nof1Physician.firstname}`,
	});
	const contactEmail2 = t('patient.contact-email', {
		email: nof1Physician.email,
	});
	const contactPhone = t('patient.contact-phone', {
		phone: nof1Physician.phone,
	});
	const greetings = t('patient.greetings');

	const text = `${warning}

${hello}

${intro}

${linkInfo}
${linkInfo2}

${link}

${contactInfo}
${contactName}
${contactEmail2}
${contactPhone}

${greetings}
`;

	const html = `<p><i>${warning}</i></p>
	<br/>
	<p>${hello}</p>
	<p>${intro}</p>
	<p>${linkInfo}</p>
	<p>${linkInfo2}</p>
	<a href=${link}>${link}</a><br/>
	<p>${contactInfo}</p>
	<p>
		${contactName}<br/>
		${contactEmail2}<br/>
		${contactPhone}
	</p>
	<p>${greetings}</p>
	`;

	return { text, html };
};

/**
 * Prepare and return the email message to be sent for password reset.
 * The message is formatted as text and html.
 * Message use the locale of session for translation.
 * @returns An object containing the email subject and
 * the message as plain text and html.
 */
export const useResetPwdMsg = () => {
	const { t } = useTranslation('auth');
	const intro = t('reset-pwd.intro');
	const intro2 = t('reset-pwd.intro-2');
	const linkInfo = t('reset-pwd.link-info');
	const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=TOKEN&id=ID`;
	const linkPlaceholder = t('reset-pwd.link');
	const ignore = t('reset-pwd.ignore');
	const greetings = t('reset-pwd.greetings');
	const app = t('reset-pwd.app');

	const text = `${intro}

${intro2}

${linkInfo}
${link}

${ignore}

${greetings}
${app}
`;

	const html = `<h3>${intro}</h3>
  <p>${intro2}</p>
	<p>${linkInfo}</p>
	<a href=${link}>${linkPlaceholder}</a><br/>
	<p>${ignore}</p>
	<p>
		${greetings}<br/>
		${app}
	</p>
	`;

	return { text, html, emailSubject: t('reset-pwd.subject') };
};
