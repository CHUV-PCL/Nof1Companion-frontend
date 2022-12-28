import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useState, ChangeEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {
	StyledTableCell,
	StyledTableRow,
	ThemedTableHead,
} from './customTableComponents';

const rowsPerPageOptions = [10, 20, 30];

interface ReadOnlyTableProps {
	headers0?: {
		name: string;
		colspan: number;
		borderR?: boolean;
	}[];
	headers: string[];
	rows: string[][];
	emptyCellHeight: number;
}

/**
 * Common read only table component, with pagination options.
 */
export default function ReadOnlyTableWPages({
	headers0,
	headers,
	rows,
	emptyCellHeight,
}: ReadOnlyTableProps) {
	const { t } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

	/**
	 * Handles table page change.
	 * @param event Not used
	 * @param newPage New page number.
	 */
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	/**
	 * Changes the number of rows displayed by the table.
	 * @param event HTML event containing the number of rows.
	 */
	const handleChangeRowsPerPage = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<>
			<TableContainer>
				<Table size="small">
					<ThemedTableHead>
						{headers0 && (
							<TableRow>
								{headers0.map((h, idx) => (
									<StyledTableCell
										key={`table-header0-${idx}`}
										align="center"
										paddingX={0.6}
										colSpan={h.colspan}
										borderR={h.borderR}
									>
										<Typography fontWeight="bold">{h.name}</Typography>
									</StyledTableCell>
								))}
							</TableRow>
						)}
						<TableRow>
							{headers.map((header, index) => (
								<StyledTableCell
									key={`table-header-${index}`}
									align="center"
									paddingX={0.6}
								>
									<Typography fontWeight="bold">{header}</Typography>
								</StyledTableCell>
							))}
						</TableRow>
					</ThemedTableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => (
								<StyledTableRow key={index}>
									{row.map((value, idx) => (
										<TableCell
											key={idx}
											align="center"
											sx={{ paddingX: '0.6rem' }}
										>
											<Typography variant="body2">{value}</Typography>
										</TableCell>
									))}
								</StyledTableRow>
							))}
						{
							/* row padding to keep table aspect ratio */
							emptyRows > 0 && (
								<TableRow
									style={{
										height: emptyCellHeight * emptyRows,
									}}
								>
									<TableCell colSpan={headers.length} />
								</TableRow>
							)
						}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				labelRowsPerPage={t('table.labelRowsPerPage')}
				labelDisplayedRows={({ from, to, count }) =>
					`${from}–${to} ${t('table.ofLabel')} ${
						count !== -1 ? count : `${t('table.moreLabel')} ${to}`
					}`
				}
				rowsPerPageOptions={rowsPerPageOptions}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
}
