import {
	Dispatch,
	FC,
	forwardRef,
	MutableRefObject,
	SetStateAction,
	useMemo,
	useState,
} from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClinicalInfoSchema } from '../../../utils/zodValidationHook';
import { IClinicalInfo } from '../../../entities/clinicalInfo';
import { IParticipants } from '../../../entities/nof1Test';
import { SectionCard } from '../../common/ui';
import SuccessSnackbar from '../../common/ui/SuccessSnackbar';
import Typography from '@mui/material/Typography';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';

// Custom multiline TextField component
const MultilineTextField: FC<TextFieldProps> = forwardRef((props, ref) => {
	return (
		<TextField
			size="small"
			fullWidth
			multiline
			minRows={2}
			maxRows={4}
			inputProps={{ maxLength: 500 }}
			inputRef={ref}
			{...props}
		/>
	);
});
MultilineTextField.displayName = 'MultilineTextField';

interface ClinicalInfoProps {
	clinicalInfo: IClinicalInfo;
	setClinicalInfo: Dispatch<SetStateAction<IClinicalInfo>>;
	participants: MutableRefObject<IParticipants>;
}

/**
 * Component rendering a form to fill in clinical information
 * about the patient and the N-of-1 test.
 */
export default function ClinicalInfo({
	clinicalInfo,
	setClinicalInfo,
	participants,
}: ClinicalInfoProps) {
	const { t } = useTranslation('createTest');
	const schema = useClinicalInfoSchema();
	const [openSuccessSB, setOpenSuccessSB] = useState(false);
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<IClinicalInfo>({
		resolver: zodResolver(schema),
		defaultValues: useMemo(() => clinicalInfo, [clinicalInfo]),
	});

	/**
	 * Handles form submit.
	 * @param data Form data.
	 */
	const submitHandler: SubmitHandler<IClinicalInfo> = (data) => {
		data.age = dayjs()
			.diff(dayjs(participants.current.patient.birthYear, 'YYYY'), 'year')
			.toString();
		setClinicalInfo(data);
		setOpenSuccessSB(true);
	};

	const checkboxOptions = [
		{ label: t('clinicalInfo.purpose.efficacy'), name: 'purpose.efficacy' },
		{
			label: t('clinicalInfo.purpose.side-effects'),
			name: 'purpose.sideEffects',
		},
		{
			label: t('clinicalInfo.purpose.deprescription'),
			name: 'purpose.deprescription',
		},
		{ label: t('clinicalInfo.purpose.dosage'), name: 'purpose.dosage' },
		{
			label: t('clinicalInfo.purpose.drugs-choice'),
			name: 'purpose.drugsChoice',
		},
		{
			label: t('clinicalInfo.purpose.generic-substitution'),
			name: 'purpose.genericSubstitutions',
		},
		{ label: t('clinicalInfo.purpose.other'), name: 'purpose.other' },
	];

	return (
		<SectionCard>
			<Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
				<Grid
					container
					alignItems="flex-start"
					justifyContent="center"
					rowSpacing={2}
					columnSpacing={4}
				>
					<Grid item xs={12}>
						<Typography variant="h5" fontWeight="bold">
							{t('clinicalInfo.title')}
						</Typography>
					</Grid>
					<Grid item container xs={12} sm={8} spacing={2}>
						<Grid item xs={12} sm={3}>
							<Controller
								name="sex"
								control={control}
								render={({ field }) => (
									<TextField
										select
										size="small"
										fullWidth
										id="sex"
										label={t('clinicalInfo.sex')}
										error={!!errors['sex']}
										helperText={errors.sex?.message}
										{...field}
									>
										<MenuItem value={t('clinicalInfo.sex-man')}>
											{t('clinicalInfo.sex-man')}
										</MenuItem>
										<MenuItem value={t('clinicalInfo.sex-woman')}>
											{t('clinicalInfo.sex-woman')}
										</MenuItem>
									</TextField>
								)}
							/>
						</Grid>
						{clinicalInfo.age && (
							<Grid item xs={12} sm={3}>
								<TextField
									size="small"
									fullWidth
									id="age"
									label={t('clinicalInfo.age')}
									disabled
									value={clinicalInfo.age}
									{...register('age')}
								/>
							</Grid>
						)}
						<Grid item xs={12} sm={3}>
							<TextField
								size="small"
								fullWidth
								id="weight"
								label={t('clinicalInfo.weight')}
								error={!!errors['weight']}
								helperText={errors.weight?.message}
								{...register('weight')}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								size="small"
								fullWidth
								id="height"
								label={t('clinicalInfo.height')}
								error={!!errors['height']}
								helperText={errors.height?.message}
								{...register('height')}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="caption">
								{t('clinicalInfo.fields-info')}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<MultilineTextField
								id="drugs"
								label={t('clinicalInfo.drugs')}
								error={!!errors['drugs']}
								helperText={errors.drugs?.message}
								{...register('drugs')}
							/>
						</Grid>
						<Grid item xs={12}>
							<MultilineTextField
								id="indication"
								label={t('clinicalInfo.indication')}
								error={!!errors['indication']}
								helperText={errors.indication?.message}
								{...register('indication')}
							/>
						</Grid>
						<Grid item xs={12}>
							<MultilineTextField
								id="otherDiag"
								label={t('clinicalInfo.other-diag')}
								error={!!errors['otherDiag']}
								helperText={errors.otherDiag?.message}
								{...register('otherDiag')}
							/>
						</Grid>
						<Grid item xs={12}>
							<MultilineTextField
								id="otherDrugs"
								label={t('clinicalInfo.other-drugs')}
								error={!!errors['otherDrugs']}
								helperText={errors.otherDrugs?.message}
								{...register('otherDrugs')}
							/>
						</Grid>
					</Grid>
					<Grid item container xs={12} sm={4}>
						<FormControl component="fieldset" variant="standard">
							<FormLabel component="legend">
								{t('clinicalInfo.purpose.title')}
							</FormLabel>
							<FormGroup>
								{checkboxOptions.map((option) => (
									<FormControlLabel
										key={option.name}
										id={option.name}
										label={option.label}
										control={
											<Controller
												name={option.name as keyof IClinicalInfo}
												control={control}
												render={({ field: { value, onChange, name } }) => {
													// wrong type interpolation. Value is of type boolean.
													const checked = Boolean(value as unknown);
													return (
														<Checkbox
															name={name}
															checked={checked}
															onChange={onChange}
														/>
													);
												}}
											/>
										}
									/>
								))}
							</FormGroup>
						</FormControl>
					</Grid>
					{Object.keys(errors).length !== 0 && (
						<Grid item xs={12}>
							<Alert severity="error">{t('common:formErrors.errorMsg')}</Alert>
						</Grid>
					)}
					<Grid item xs={6} sm={4}>
						<Button type="submit" variant="contained" fullWidth>
							{t('common:button.save')}
						</Button>
					</Grid>
				</Grid>
			</Box>
			<SuccessSnackbar
				open={openSuccessSB}
				setOpen={setOpenSuccessSB}
				msg={t('common:formErrors.successMsg')}
			/>
		</SectionCard>
	);
}
