import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';

interface RecapDurationProps {
	nbPeriods: number;
	periodLen: number;
	beginningDate: Date | undefined;
	endingDate: Date | undefined;
}

/**
 * Component rendering the duration parameters of the N-of-1 test.
 */
export default function RecapDuration({
	nbPeriods,
	periodLen,
	beginningDate,
	endingDate,
}: RecapDurationProps) {
	const { t } = useTranslation('createTest');

	return (
		<Grid container spacing={2} pl={'2rem'}>
			<Grid item xs={12}>
				<Typography variant="h5">
					{t('parameters.subtitle-duration')}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					size="small"
					label={t('parameters.periods-nb')}
					defaultValue={nbPeriods}
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					size="small"
					label={t('parameters.period-duration')}
					defaultValue={periodLen}
					InputProps={{
						readOnly: true,
					}}
				/>
			</Grid>
			{beginningDate && (
				<Grid item xs={12} sm={6}>
					<TextField
						size="small"
						label={t('common:startingDate')}
						// date can be a string or Date, so wrapping with dayjs to
						// ensure to have a Date Object with both cases.
						defaultValue={dayjs(beginningDate).toDate().toLocaleDateString()}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>
			)}
			{endingDate && (
				<Grid item xs={12} sm={6}>
					<TextField
						size="small"
						label={t('common:endingDate')}
						defaultValue={dayjs(endingDate).toDate().toLocaleDateString()}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>
			)}
		</Grid>
	);
}
