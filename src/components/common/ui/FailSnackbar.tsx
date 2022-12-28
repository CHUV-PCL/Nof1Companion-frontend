import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Dispatch, SetStateAction } from 'react';

interface FailSnackbarProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	msg: string;
}

/**
 * Common failure Snackbar component.
 */
export default function FailSnackbar({
	open,
	setOpen,
	msg,
}: FailSnackbarProps) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={4000}
			onClose={() => setOpen(false)}
		>
			<Alert variant="filled" severity="error" onClose={() => setOpen(false)}>
				{msg}
			</Alert>
		</Snackbar>
	);
}
