import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { IClinicalInfo } from '../../../entities/clinicalInfo';
import ReadOnlyForm from '../../common/forms/ReadOnlyForm';
import Stack from '@mui/material/Stack';

interface RecapClinicalInfoProps {
	clinicalInfo: IClinicalInfo;
}

/**
 * Component rendering the clinical information
 * about the patient and the N-of-1 test.
 */
export default function RecapClinicalInfo({
	clinicalInfo,
}: RecapClinicalInfoProps) {
	const { t } = useTranslation('createTest');
	const inputs = [
		{
			name: 'sex',
			value: clinicalInfo.sex,
			label: t('clinicalInfo.sex'),
			size: 3,
		},
		{
			name: 'age',
			value: clinicalInfo.age,
			label: t('clinicalInfo.age'),
			size: 3,
		},
		{
			name: 'weight',
			value: clinicalInfo.weight,
			label: t('clinicalInfo.weight'),
			size: 3,
		},
		{
			name: 'height',
			value: clinicalInfo.height,
			label: t('clinicalInfo.height'),
			size: 3,
		},
		{
			name: 'indication',
			value: clinicalInfo.indication,
			label: t('clinicalInfo.indication'),
		},
		{
			name: 'otherDiag',
			value: clinicalInfo.otherDiag,
			label: t('clinicalInfo.other-diag'),
		},
		{
			name: 'drugs',
			value: clinicalInfo.drugs,
			label: t('clinicalInfo.drugs'),
		},
		{
			name: 'otherDrugs',
			value: clinicalInfo.otherDrugs,
			label: t('clinicalInfo.other-drugs'),
		},
	];

	const checkboxOptions = [
		{
			label: t('clinicalInfo.purpose.efficacy'),
			value: clinicalInfo.purpose.efficacy,
		},
		{
			label: t('clinicalInfo.purpose.side-effects'),
			value: clinicalInfo.purpose.sideEffects,
		},
		{
			label: t('clinicalInfo.purpose.deprescription'),
			value: clinicalInfo.purpose.deprescription,
		},
		{
			label: t('clinicalInfo.purpose.dosage'),
			value: clinicalInfo.purpose.dosage,
		},
		{
			label: t('clinicalInfo.purpose.drugs-choice'),
			value: clinicalInfo.purpose.drugsChoice,
		},
		{
			label: t('clinicalInfo.purpose.generic-substitution'),
			value: clinicalInfo.purpose.genericSubstitutions,
		},
		{
			label: t('clinicalInfo.purpose.other'),
			value: clinicalInfo.purpose.other,
		},
	];

	return (
		<Grid container alignItems="flex-start" columnSpacing={4}>
			<Grid item xs={12}>
				<Typography variant="h5">{t('clinicalInfo.title')}</Typography>
			</Grid>
			<Grid item xs={12} sm={8}>
				<ReadOnlyForm inputs={inputs} />
			</Grid>
			<Grid item xs={12} sm={4}>
				<Typography>{t('clinicalInfo.purpose.title')}</Typography>
				{checkboxOptions.map((option, idx) => (
					<Stack key={idx} direction="row" alignItems="center">
						<Checkbox checked={option.value} disableRipple />
						<Typography>{option.label}</Typography>
					</Stack>
				))}
			</Grid>
		</Grid>
	);
}
