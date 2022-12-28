import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Variable } from '../../../entities/variable';
import {
	ThemedTableHead,
	StyledTableContainer,
} from '../../common/table/customTableComponents';
import { useRenderVariableType } from '../../../hooks/variables';

/**
 * Helper method to render a TableCell component.
 * @param name Cell content.
 * @returns The TableCell component.
 */
const renderTableCell = (name: string | number | undefined) => {
	return (
		<TableCell align="center">
			<Typography variant="body2">{name}</Typography>
		</TableCell>
	);
};

type VarTableProps = {
	rows: Variable[];
	removeRow: (idx: number) => void;
	edit: (idx: number, v: Variable) => void;
};

/**
 * Table component for health variables.
 */
export default function VarTable({ rows, removeRow, edit }: VarTableProps) {
	const { t } = useTranslation('createTest');
	const selectTrad = useRenderVariableType();
	const headers = [
		t('variables.header.name'),
		t('variables.header.type'),
		t('variables.header.desc'),
		t('variables.header.unit'),
		t('variables.header.min'),
		t('variables.header.max'),
		t('variables.header.values'),
		t('variables.header.skip'),
		'',
	];

	return (
		<Box width={'100%'} my={'2rem'}>
			<StyledTableContainer>
				<Table>
					<ThemedTableHead>
						<TableRow>
							{headers.map((header, index) => (
								<TableCell key={`var-header-${index}`} align="center">
									<Typography variant="body1" fontWeight="bold">
										{header}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</ThemedTableHead>
					<TableBody>
						{rows.map((variable, index) => (
							// iterate over object properties does not guarantee right ordering
							<TableRow key={variable.name}>
								{renderTableCell(variable.name)}
								{renderTableCell(selectTrad(variable.type))}
								{renderTableCell(variable.desc)}
								{renderTableCell(variable.unit)}
								{renderTableCell(variable.min)}
								{renderTableCell(variable.max)}
								{renderTableCell(variable.values)}
								{renderTableCell(variable.skippedRunInDays)}
								<TableCell align="center">
									<IconButton
										aria-label="edit"
										onClick={() => edit(index, variable)}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										color="error"
										aria-label="delete"
										onClick={() => removeRow(index)}
									>
										<DeleteForeverIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</StyledTableContainer>
		</Box>
	);
}
