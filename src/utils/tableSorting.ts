// Table sorting utilities
// Source: https://mui.com/material-ui/react-table/#sorting-amp-selecting

export type Order = 'asc' | 'desc';

/**
 * Generic descending comparator between two element.
 * @param a Element a.
 * @param b Element b.
 * @param orderBy key of element to compare.
 * @returns -1 if b is before a, 1 otherwise and 0 if same.
 */
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

/**
 * Get the correct comparator according to order and orderBy.
 * @param order Order of comparison.
 * @param orderBy Key of element defining the order.
 * @returns The appropriate comparator.
 */
export function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key,
): (
	a: { [key in Key]: number | string | Date },
	b: { [key in Key]: number | string | Date },
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}
