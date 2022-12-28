import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { MouseEvent } from 'react';
import { Order } from '../../../utils/tableSorting';

export type HeadCell<T> = {
	disablePadding: boolean;
	id: keyof T;
	label: string;
	align: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
};

export interface EnhancedTableHeadProps<T> {
	headCells: readonly HeadCell<T>[];
	onRequestSort: (event: MouseEvent<unknown>, property: keyof T) => void;
	order: Order;
	orderBy: keyof T;
}

/**
 * Common head table component, with sorting functionalities.
 */
export default function EnhancedTableHead<T>({
	headCells,
	order,
	orderBy,
	onRequestSort,
}: EnhancedTableHeadProps<T>) {
	const createSortHandler =
		(property: keyof T) => (event: MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id.toString()}
						align={headCell.align}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							<Typography component="h2" variant="h6" fontWeight="bold">
								{headCell.label}
							</Typography>
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
