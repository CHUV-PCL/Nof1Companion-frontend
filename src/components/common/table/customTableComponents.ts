import TableContainer, {
	TableContainerProps,
} from '@mui/material/TableContainer';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableHead, { TableHeadProps } from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';

interface StyledTableCellProps extends TableCellProps {
	borderR?: boolean;
	paddingX?: number;
}

/**
 * Custom TableCell component. Additional optional properties:
 * @property {boolean} [borderR=true] Determine if a right border is drawn.
 * @property {number} [paddingX=1] Determine the horizontal padding, in a multiple of rem.
 */
export const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'borderR' && prop !== 'paddingX',
})<StyledTableCellProps>(({ borderR = true, paddingX = 1, theme }) => ({
	...(borderR && { borderRight: '1px solid' }),
	borderColor: theme.palette.divider,
	paddingInline: `${paddingX}rem`,
}));

// custom TableRow component
export const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
}));

// custom TableContainer component
export const StyledTableContainer = styled(TableContainer)<TableContainerProps>(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: `${theme.shape.borderRadius * 2}px ${
			theme.shape.borderRadius * 2
		}px 0 0`,
	}),
);

// custom TableHead component
export const ThemedTableHead = styled(TableHead)<TableHeadProps>(
	({ theme }) => ({
		backgroundColor: theme.palette.primary.light,
	}),
);
