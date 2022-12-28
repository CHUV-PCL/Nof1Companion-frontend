import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Input from '@mui/material/Input';
import PosologyHead from './PosologyHead';
import {
	StyledTableCell,
	StyledTableContainer,
	StyledTableRow,
} from '../customTableComponents';
import { PosologyDay } from '../../../../entities/posology';

export type RegisterType =
	| `${number}`
	| `${number}.day`
	| `${number}.morning`
	| `${number}.morningFraction`
	| `${number}.noon`
	| `${number}.noonFraction`
	| `${number}.evening`
	| `${number}.eveningFraction`
	| `${number}.night`
	| `${number}.nightFraction`;

interface EditablePosologyTableProps {
	rows: PosologyDay[];
	substanceUnit: string;
	renderTableCell: (
		name: RegisterType,
		defaultValue: number,
		borderRight?: boolean,
	) => JSX.Element;
}

export default function EditablePosologyTable({
	rows,
	substanceUnit,
	renderTableCell,
}: EditablePosologyTableProps) {
	return (
		<StyledTableContainer>
			<Table size="small">
				<PosologyHead substanceUnit={substanceUnit} />
				<TableBody>
					{rows.map((posology, index) => (
						// iterate over object properties does not guarantee right ordering
						<StyledTableRow key={`table-row-${index}`}>
							<StyledTableCell align="center">
								<Input
									size="small"
									id={`${index}.day`}
									inputProps={{ style: { textAlign: 'center' } }}
									value={posology.day}
									disableUnderline
									readOnly
								/>
							</StyledTableCell>
							{renderTableCell(`${index}.morning`, posology.morning)}
							{renderTableCell(
								`${index}.morningFraction`,
								posology.morningFraction,
								true,
							)}
							{renderTableCell(`${index}.noon`, posology.noon)}
							{renderTableCell(
								`${index}.noonFraction`,
								posology.noonFraction,
								true,
							)}
							{renderTableCell(`${index}.evening`, posology.evening)}
							{renderTableCell(
								`${index}.eveningFraction`,
								posology.eveningFraction,
								true,
							)}
							{renderTableCell(`${index}.night`, posology.night)}
							{renderTableCell(
								`${index}.nightFraction`,
								posology.nightFraction,
							)}
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</StyledTableContainer>
	);
}
