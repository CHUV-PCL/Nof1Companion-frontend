import { MutableRefObject, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import { useUserContext } from '../../../context/UserContext';
import { IParticipants } from '../../../entities/nof1Test';
import { FormCard } from '../../common/ui';
import SuccessSnackbar from '../../common/ui/SuccessSnackbar';
import FailSnackbar from '../../common/ui/FailSnackbar';
import FormWithValidation, {
	FormInput,
} from '../../common/forms/FormWithValidation';
import {
	usePatientSchema,
	PatientFormData,
} from '../../../utils/zodValidationHook';
import {
	formatPatientData,
	formatPatientDataToForm,
} from '../../../utils/dataFormConvertor';
import {
	createPatient,
	findPatient,
	updatePatient,
} from '../../../utils/nof1-lib/api-calls/apiPatients';
import { isPatientInfoEqual } from '../../../utils/nof1-lib/lib';

type PatientFormProps = {
	participants: MutableRefObject<IParticipants>;
};

/**
 * Component that manages and renders the patient form.
 */
export default function PatientForm({ participants }: PatientFormProps) {
	const { t } = useTranslation('common');
	const { userContext } = useUserContext();
	const schema = usePatientSchema();
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'firstname', trad: t('form.firstname'), required: true, size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), required: true, size: 6 },
		{ name: 'phone', trad: t('form.phone'), required: true },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'birthYear', trad: t('form.birth-year'), required: true, size: 6 },
		{ name: 'country', trad: t('form.country'), size: 6 },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 5 },
		{ name: 'city', trad: t('form.city'), size: 7 },
		{ name: 'insurance', trad: t('form.insurance'), required: true },
		{ name: 'insuranceNb', trad: t('form.insuranceNb'), required: true },
	];

	/**
	 * Handle the form submit. It checks if the data has changed and triggers
	 * a patient creation or update if he already exists. It also triggers
	 * success or failure snackbar.
	 * @param data Data from the form.
	 */
	const handleSubmit = async (data: PatientFormData) => {
		const newPatient = formatPatientData(data);
		let creationError = false;
		let updateError = false;
		if (!isPatientInfoEqual(participants.current.patient, newPatient)) {
			// check existence to determine an update or a creation.
			const patientInDB = await findPatient(
				userContext.access_token,
				newPatient.email,
			);
			if (!patientInDB) {
				// new patient
				if (data._id) {
					delete newPatient._id;
					// remove _id to avoid duplicate key in DB collection.
					// In case the email was changed for an existing patient
					// and a new patient creation is triggered.
				}
				const { success, response } = await createPatient(
					userContext.access_token,
					newPatient,
				);
				creationError = !success;
				newPatient._id = response._id; // undefined if not present
			} else {
				newPatient._id = patientInDB._id;
				if (!isPatientInfoEqual(patientInDB, newPatient)) {
					// update information in DB if needed
					const { success } = await updatePatient(
						userContext.access_token,
						newPatient._id!,
						newPatient,
					);
					updateError = !success;
				}
			}
		}
		if (creationError || updateError) {
			setOpenFailSnackbar(true);
		} else {
			participants.current.patient = newPatient;
			setOpenSuccessSnackbar(true);
		}
	};

	return (
		<FormCard>
			<Typography variant="h6" align="center">
				{t('createTest:participants.patient')}
			</Typography>
			<FormWithValidation<PatientFormData>
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.save')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={handleSubmit}
				defaultValues={formatPatientDataToForm(participants.current.patient)}
			/>
			<SuccessSnackbar
				open={openSuccessSnackbar}
				setOpen={setOpenSuccessSnackbar}
				msg={t('formErrors.successMsg')}
			/>
			<FailSnackbar
				open={openFailSnackbar}
				setOpen={setOpenFailSnackbar}
				msg={t('formErrors.unexpectedErrorMsg')}
			/>
		</FormCard>
	);
}
