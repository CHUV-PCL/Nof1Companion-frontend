import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { ReactNode } from 'react';

interface LogbookCardProps {
	children: ReactNode;
	idx: number;
	startDate: Date | string;
	periodLen: number;
	showPeriodQuestions: boolean;
}

/**
 * Component that renders the card layout of the variable inputs for a day.
 */
export default function LogbookCard({
	children,
	idx,
	startDate,
	periodLen,
	showPeriodQuestions,
}: LogbookCardProps) {
	const { t } = useTranslation('common');

	return (
		<Paper variant="outlined" sx={{ padding: 3, maxWidth: 900, width: '100%' }}>
			{/* header */}
			<Stack direction="row" justifyContent="space-between" mb={2}>
				<Typography>
					{t('date')} :{' '}
					{dayjs(startDate).add(idx, 'day').toDate().toLocaleDateString()}
				</Typography>
				<Typography>
					{t('day')} {idx + 1}{' '}
					{showPeriodQuestions &&
						`| ${t('importData:period')} ${Math.floor(idx / periodLen) + 1}`}
				</Typography>
			</Stack>
			{/* content */}
			<Grid id="card-content" container rowSpacing={1} columnSpacing={2} px={1}>
				{children}
			</Grid>
		</Paper>
	);
}
