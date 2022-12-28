import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Dispatch, SetStateAction } from 'react';

interface SuccessSnackbarProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	msg: string;
}

/**
 * Common success Snackbar component.
 */
export default function SuccessSnackbar({
	open,
	setOpen,
	msg,
}: SuccessSnackbarProps) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={4000}
			onClose={() => setOpen(false)}
		>
			<Alert variant="filled" severity="success" onClose={() => setOpen(false)}>
				{msg}
			</Alert>
		</Snackbar>
	);
}
