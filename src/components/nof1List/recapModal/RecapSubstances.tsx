import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { Substance } from '../../../entities/substance';

interface RecapSubstancesProps {
	substances: Substance[];
}

/**
 * Component rendering all chosen substances.
 */
export default function RecapSubstances({ substances }: RecapSubstancesProps) {
	const { t } = useTranslation('createTest');

	return (
		<Stack spacing={2}>
			<Typography variant="h5">
				{t('parameters.subtitle-substances')}
			</Typography>
			{substances.map((s) => (
				<Stack key={s.name} direction="row" spacing={2}>
					<TextField
						size="small"
						label={t('parameters.substance-name')}
						defaultValue={s.name}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						size="small"
						label={t('parameters.substance-abbrev')}
						defaultValue={s.abbreviation}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						size="small"
						label={t('common:measure-unit-label')}
						defaultValue={s.unit}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Stack>
			))}
		</Stack>
	);
}
