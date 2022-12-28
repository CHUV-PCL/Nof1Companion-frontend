import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { Stats } from '../../../utils/statistics';

/**
 * Helper method to format a decimal number.
 * @param decimal Number of decimal to display.
 * @returns The formatted number.
 */
const formatter = (decimal: number = 3) =>
	new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimal,
	});

/**
 * Helper method to render a TableCell component.
 * @param val Cell content.
 * @param format Number of decimal for the value.
 * @returns The TableCell component.
 */
export const renderTableCell = (val: number, format = 3) => {
	return (
		<TableCell
			align="right"
			sx={{ borderLeft: 1, borderRight: 1, borderColor: 'divider' }}
		>
			<Typography variant="body2">{formatter(format).format(val)}</Typography>
		</TableCell>
	);
};

export interface StatsTableProps {
	substances: string[];
	stats: Stats;
	additionalInfoTop?: JSX.Element;
	additionalInfoCenter?: JSX.Element;
}

/**
 * Component rendering the statistical analysis table.
 * Base component to render the naive ANOVA and extendable for Cycle ANOVA
 * and ANCOVA auto-regression.
 */
export default function StatsTable({
	substances,
	stats,
	additionalInfoTop,
	additionalInfoCenter,
}: StatsTableProps) {
	const { t } = useTranslation('results');
	const statsHeader = ['SS', 'df', 'MS', 'F', 'p'];

	return (
		<TableContainer>
			<Table size="small">
				<TableBody>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.treatment')}
							</Typography>
						</TableCell>
						{substances.map((s) => (
							<TableCell key={s} align="right">
								<Typography variant="body2" fontWeight="bold">
									{s}
								</Typography>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2">
								{t('statistics.treat-effect')}
							</Typography>
						</TableCell>
						{stats.treatment.effect.map((e, idx) => (
							<TableCell key={`treat-effect-${idx}`} align="right">
								<Typography variant="body2">{formatter().format(e)}</Typography>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.total-mean')}
							</Typography>
						</TableCell>
						<TableCell align="right">
							<Typography variant="body2">
								{formatter().format(stats.total.mean)}
							</Typography>
						</TableCell>
					</TableRow>
					{additionalInfoTop}
					<TableRow></TableRow>
					<TableRow>
						<TableCell
							component="th"
							scope="row"
							sx={{ borderTop: 1, borderBottom: 1 }}
						></TableCell>
						{statsHeader.map((e) => (
							<TableCell
								key={e}
								align="center"
								sx={{
									border: 1,
									borderLeftColor: 'divider',
									borderRightColor: 'divider',
								}}
							>
								<Typography variant="body2" fontWeight="bold">
									{e}
								</Typography>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.treatment')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.treatment.SS)}
						{renderTableCell(stats.treatment.DF)}
						{renderTableCell(stats.treatment.MS)}
						{renderTableCell(stats.treatment.F)}
						{renderTableCell(stats.treatment.P, 10)}
					</TableRow>
					{additionalInfoCenter}
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.residual')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.residual.SS)}
						{renderTableCell(stats.residual.DF)}
						{renderTableCell(stats.residual.MS)}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.total')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.total.SS)}
						{renderTableCell(stats.total.DF)}
						{renderTableCell(stats.total.MS)}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
