import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { useState, MouseEvent, ChangeEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Nof1TableItem from './Nof1TableItem';
import EnhancedTableHead, { HeadCell } from '../common/table/EnhancedTableHead';
import { getComparator, Order } from '../../utils/tableSorting';
import { Nof1Test } from '../../entities/nof1Test';
import { Nof1TableInterface } from '../../pages/nof1';
import { useUserContext } from '../../context/UserContext';

const rowsPerPageOptions = [5, 10, 15];

type Nof1TableProps = {
	headCells: readonly HeadCell<Nof1TableInterface>[];
	rows: Nof1TableInterface[];
	data: Nof1Test[];
	loading: boolean;
};

/**
 * Table component to display all user's N-of-1 tests.
 */
export default function Nof1Table({
	headCells,
	rows,
	data,
	loading,
}: Nof1TableProps) {
	const { t } = useTranslation('common');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] =
		useState<keyof Nof1TableInterface>('creationDate');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const { userContext } = useUserContext();

	/**
	 * Sorts the table according to the property clicked.
	 * @param event Mouse event (not used)
	 * @param property Property which define the order.
	 */
	const handleRequestSort = (
		event: MouseEvent<unknown>,
		property: keyof Nof1TableInterface,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

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
	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	/**
	 * Retrieves the test from its id.
	 * @param id Id of the test.
	 * @returns A Nof1 test.
	 */
	const getItemData = (id: string) => {
		return data.find((test) => test.uid === id)!;
		// ids are generated from data, thus 'find' will always return an element
	};

	return (
		<Box width={'100%'}>
			<Paper>
				<TableContainer>
					<Table aria-labelledby="tableTitle" size="medium">
						<EnhancedTableHead
							headCells={headCells}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{loading ? (
								Array.from({
									length: Math.min(
										rowsPerPageOptions[0],
										userContext.user?.tests?.length ?? 1,
									),
								}).map((_, idx) => (
									<TableRow key={idx} style={{ height: 125 }}>
										<TableCell colSpan={3} height="100%">
											<Skeleton
												variant="rectangular"
												animation="wave"
												height={90}
												width="100%"
											/>
										</TableCell>
									</TableRow>
								))
							) : (
								<>
									{rows
										.slice()
										.sort(getComparator(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) => {
											const labelId = `enhanced-table-${index}`;
											return (
												<Nof1TableItem
													item={getItemData(row.id)}
													labelId={labelId}
													key={row.id}
												/>
											);
										})}
									{
										/* row padding to keep table aspect ratio */
										emptyRows > 0 && (
											<TableRow
												style={{
													height: 125 * emptyRows,
												}}
											>
												<TableCell colSpan={6} />
											</TableRow>
										)
									}
								</>
							)}
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
			</Paper>
		</Box>
	);
}
