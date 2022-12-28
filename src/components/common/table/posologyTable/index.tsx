import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import { PosologyDay } from '../../../../entities/posology';
import PosologyHead from './PosologyHead';
import {
	StyledTableCell,
	StyledTableContainer,
} from '../customTableComponents';

/**
 * Helper method to render a TableCell component.
 * @param value Cell content.
 * @param borderRight Display a right border.
 * @returns The TableCell component.
 */
const renderTableCell = (value: number, borderRight: boolean = false) => {
	return (
		<StyledTableCell align="center" borderR={borderRight}>
			<Typography variant="body2">{value}</Typography>
		</StyledTableCell>
	);
};

interface PosologyTableProps {
	posology: PosologyDay[];
	substanceUnit: string;
}

/**
 * Component to display the tables of posologies for all substances.
 */
export default function PosologyTable({
	posology,
	substanceUnit,
}: PosologyTableProps) {
	return (
		<StyledTableContainer>
			<Table size="small">
				<PosologyHead substanceUnit={substanceUnit} />
				<TableBody>
					{posology.map((row, index) => (
						// iterate over object properties does not guarantee right ordering
						<TableRow key={index}>
							{renderTableCell(row.day, true)}
							{renderTableCell(row.morning)}
							{renderTableCell(row.morningFraction, true)}
							{renderTableCell(row.noon)}
							{renderTableCell(row.noonFraction, true)}
							{renderTableCell(row.evening)}
							{renderTableCell(row.eveningFraction, true)}
							{renderTableCell(row.night)}
							{renderTableCell(row.nightFraction)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</StyledTableContainer>
	);
}
