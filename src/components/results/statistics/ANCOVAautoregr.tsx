import StatsTable, { renderTableCell, StatsTableProps } from './StatsTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';

/**
 * Component rendering the ANCOVA auto-regression table.
 */
export default function ANCOVAautoregr({ substances, stats }: StatsTableProps) {
	const { t } = useTranslation('results');
	const header = [
		t('statistics.slope'),
		t('statistics.intercept'),
		t('statistics.correlation'),
	];
	const autoregrInfoTop = (
		<>
			<TableRow>
				<TableCell component="th" scope="row"></TableCell>
				{header.map((h) => (
					<TableCell key={h} sx={{ border: 1, borderColor: 'divider' }}>
						<Typography variant="body2" align="center" fontWeight="bold">
							{h}
						</Typography>
					</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{t('statistics.autoregression')}
					</Typography>
				</TableCell>
				{renderTableCell(stats.meta!.slope)}
				{renderTableCell(stats.meta!.intercept)}
				{renderTableCell(stats.meta!.corr)}
			</TableRow>
		</>
	);
	const autoregrInfoCenter = (
		<TableRow>
			<TableCell component="th" scope="row">
				<Typography variant="body2" fontWeight="bold">
					{t('statistics.autoregression')}
				</Typography>
			</TableCell>
			{renderTableCell(stats.autoregr!.SS)}
			{renderTableCell(stats.autoregr!.DF)}
			{renderTableCell(stats.autoregr!.MS)}
			{renderTableCell(stats.autoregr!.F)}
			{renderTableCell(stats.autoregr!.P, 10)}
		</TableRow>
	);

	return (
		<StatsTable
			substances={substances}
			stats={stats}
			additionalInfoTop={autoregrInfoTop}
			additionalInfoCenter={autoregrInfoCenter}
		/>
	);
}
