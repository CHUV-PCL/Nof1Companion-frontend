import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { ThemedTableHead, StyledTableCell } from '../customTableComponents';

interface PosologyHeadProps {
	substanceUnit: string;
}

export default function PosologyHead({ substanceUnit }: PosologyHeadProps) {
	const { t } = useTranslation('common');
	const headers0 = [
		t('posology-table.morning'),
		t('posology-table.noon'),
		t('posology-table.evening'),
		t('posology-table.night'),
	];
	const col = [
		t('posology-table.dose', { unit: substanceUnit }),
		t('posology-table.fraction'),
	];
	const headers = [t('posology-table.day'), ...col, ...col, ...col, ...col];

	return (
		<ThemedTableHead>
			<TableRow>
				<StyledTableCell padding="none"></StyledTableCell>
				{headers0.map((h, idx) => (
					<StyledTableCell
						key={`posology-header0-${idx}`}
						align="center"
						colSpan={2}
					>
						<Typography fontWeight="bold">{h}</Typography>
					</StyledTableCell>
				))}
			</TableRow>
			<TableRow sx={{ border: 0 }}>
				{headers.map((header, index) => (
					<StyledTableCell
						key={`posology-header1-${index}`}
						align="center"
						borderR={index % 2 === 0}
					>
						<Typography variant="body2" fontWeight="bold">
							{header}
						</Typography>
					</StyledTableCell>
				))}
			</TableRow>
		</ThemedTableHead>
	);
}
