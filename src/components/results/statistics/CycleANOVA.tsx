import StatsTable, { renderTableCell, StatsTableProps } from './StatsTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';

/**
 * Component rendering the cycle ANOVA table.
 */
export default function CycleANOVA({ substances, stats }: StatsTableProps) {
	const { t } = useTranslation('results');
	const cycleInfo = (
		<>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{t('statistics.cycle')}
					</Typography>
				</TableCell>
				{renderTableCell(stats.cycle!.SS)}
				{renderTableCell(stats.cycle!.DF)}
				{renderTableCell(stats.cycle!.MS)}
				{renderTableCell(stats.cycle!.F)}
				{renderTableCell(stats.cycle!.P, 10)}
			</TableRow>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{t('statistics.treatXcycle')}
					</Typography>
				</TableCell>
				{renderTableCell(stats.treatmentCycle!.SS)}
				{renderTableCell(stats.treatmentCycle!.DF)}
				{renderTableCell(stats.treatmentCycle!.MS)}
			</TableRow>
		</>
	);

	return (
		<StatsTable
			substances={substances}
			stats={stats}
			additionalInfoCenter={cycleInfo}
		/>
	);
}
