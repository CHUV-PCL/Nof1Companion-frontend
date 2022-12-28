import useTranslation from 'next-translate/useTranslation';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormCard } from '../../common/ui';
import ReadOnlyForm from '../../common/forms/ReadOnlyForm';
import { IParticipants } from '../../../entities/nof1Test';
import { Physician } from '../../../entities/people';

interface RecapParticipantsProps {
	participants: IParticipants;
}

/**
 * Component rendering the information of the test's participants.
 */
export default function RecapParticipants({
	participants,
}: RecapParticipantsProps) {
	const { t } = useTranslation('common');

	const patientInputs = [
		{
			name: 'firstname',
			value: participants.patient.firstname,
			label: t('form.firstname'),
			size: 6,
		},
		{
			name: 'lastname',
			value: participants.patient.lastname,
			label: t('form.lastname'),
			size: 6,
		},
		{
			name: 'phone',
			value: participants.patient.phone,
			label: t('form.phone'),
		},
		{
			name: 'email',
			value: participants.patient.email,
			label: t('form.email'),
		},
		{
			name: 'birthYear',
			value: participants.patient.birthYear,
			label: t('form.birth-year'),
			size: 5,
		},
		{
			name: 'country',
			value: participants.patient.address.country,
			label: t('form.country'),
			size: 7,
		},
		{
			name: 'street',
			value: participants.patient.address.street,
			label: t('form.street'),
		},
		{
			name: 'zip',
			value: participants.patient.address.zip,
			label: t('form.zip'),
			size: 5,
		},
		{
			name: 'city',
			value: participants.patient.address.city,
			label: t('form.city'),
			size: 7,
		},
		{
			name: 'insurance',
			value: participants.patient.insurance,
			label: t('form.insurance'),
		},
		{
			name: 'insuranceNb',
			value: participants.patient.insuranceNb,
			label: t('form.insuranceNb'),
		},
	];

	const physicianInputs = (physician: Physician) => [
		{
			name: 'firstname',
			value: physician.firstname,
			label: t('form.firstname'),
			size: 6,
		},
		{
			name: 'lastname',
			value: physician.lastname,
			label: t('form.lastname'),
			size: 6,
		},
		{
			name: 'phone',
			value: physician.phone,
			label: t('form.phone'),
		},
		{
			name: 'email',
			value: physician.email,
			label: t('form.email'),
		},
		{
			name: 'country',
			value: physician.address.country,
			label: t('form.country'),
		},
		{
			name: 'street',
			value: physician.address.street,
			label: t('form.street'),
		},
		{
			name: 'zip',
			value: physician.address.zip,
			label: t('form.zip'),
			size: 5,
		},
		{
			name: 'city',
			value: physician.address.city,
			label: t('form.city'),
			size: 7,
		},
		{
			name: 'institution',
			value: physician.institution,
			label: t('form.institution'),
		},
	];

	const pharmaInputs = [
		{
			name: 'name',
			value: participants.pharmacy.name,
			label: t('form.lastname'),
		},
		{
			name: 'email',
			value: participants.pharmacy.email,
			label: t('form.email'),
		},
		{
			name: 'phone',
			value: participants.pharmacy.phone,
			label: t('form.phone'),
			size: 6,
		},
		{
			name: 'country',
			value: participants.pharmacy.address.country,
			label: t('form.country'),
			size: 6,
		},
		{
			name: 'street',
			value: participants.pharmacy.address.street,
			label: t('form.street'),
		},
		{
			name: 'zip',
			value: participants.pharmacy.address.zip,
			label: t('form.zip'),
			size: 5,
		},
		{
			name: 'city',
			value: participants.pharmacy.address.city,
			label: t('form.city'),
			size: 7,
		},
	];

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h5">
					{t('createTest:participants.title')}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={4}>
				<FormCard>
					<Typography variant="h6">
						{t('createTest:participants.patient')}
					</Typography>
					<ReadOnlyForm inputs={patientInputs} />
				</FormCard>
			</Grid>
			<Grid item xs={12} sm={4}>
				<FormCard>
					<Typography variant="h6">
						{t('createTest:participants.requestingPhysician')}
					</Typography>
					<ReadOnlyForm
						inputs={physicianInputs(participants.requestingPhysician)}
					/>
				</FormCard>
			</Grid>
			<Grid item xs={12} sm={4}>
				<FormCard>
					<Typography variant="h6">
						{t('createTest:participants.pharmacy')}
					</Typography>
					<ReadOnlyForm inputs={pharmaInputs} />
				</FormCard>
			</Grid>
			{participants.attendingPhysician && (
				<Grid item xs={12} sm={4}>
					<FormCard>
						<Typography variant="h6">
							{t('createTest:participants.attendingPhysician')}
						</Typography>
						<ReadOnlyForm
							inputs={physicianInputs(participants.attendingPhysician)}
						/>
					</FormCard>
				</Grid>
			)}
		</Grid>
	);
}
