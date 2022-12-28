import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { emailRegex } from '../../utils/constants';

interface Props {
	open: boolean;
	handleClose: () => void;
	handleDialogSubmit: (email: string) => void;
	email: string;
}

/**
 * Dialog component asking the user to confirm the email of the pharmacy.
 */
export default function EmailConfirmDialog({
	open,
	handleClose,
	handleDialogSubmit,
	email,
}: Props) {
	const { t } = useTranslation('common');
	const [value, setValue] = useState(email);

	/**
	 * Checks input's validity.
	 * @returns true if the input is valid, false otherwise.
	 */
	const isInputValid = () => {
		return emailRegex.test(value);
	}

	/**
	 * Handle the submit action of the dialog button. It triggers the parent action.
	 */
	const handleSend = () => {
		if (isInputValid()) {
			handleDialogSubmit(value);
			handleClose();
		}
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle variant="body1">{t('nof1List:email.confirm')}</DialogTitle>
			<DialogContent>
				<Box mt={1}>
					<TextField
						fullWidth
						autoFocus
						id="emailInput"
						label={t('form.email')}
						autoComplete="email"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						error={!isInputValid()}
						helperText={!isInputValid() && t('formErrors.emailInvalid')}
					></TextField>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{t('button.cancel')}</Button>
				<Button onClick={handleSend}>{t('button.send')}</Button>
			</DialogActions>
		</Dialog>
	);
}
