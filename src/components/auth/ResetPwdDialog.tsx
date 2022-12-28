import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { emailRegex } from '../../utils/constants';
import { userExists } from '../../utils/nof1-lib/api-calls/apiUsers';
import { resetPassword } from '../../utils/nof1-lib/api-calls/apiEmail';
import { useResetPwdMsg } from '../../hooks/email';

interface Props {
	open: boolean;
	handleClose: () => void;
}

/**
 * Dialog to send a password reset link to the user.
 */
export default function ResetPwdDialog({ open, handleClose }: Props) {
	const { t } = useTranslation('common');
	const [value, setValue] = useState('');
	const [userNotFound, setUserNotFound] = useState(false);
	const [loading, setLoading] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [failAlert, setFailAlert] = useState(false);
	const { text, html, emailSubject } = useResetPwdMsg();

	/**
	 * Checks input's validity.
	 * @returns true if the input is valid, false otherwise.
	 */
	const isInputValid = () => emailRegex.test(value);

	/**
	 * Handles the submit action of the dialog button.
	 * Checks validity and sends the request to send the password reset link.
	 */
	const handleSend = async () => {
		const { success, exists } = await userExists(value);
		if (success && exists) {
			const res = await resetPassword({ text, html }, value, emailSubject);
			res.success ? setSuccessAlert(true) : setFailAlert(true);
		} else {
			setUserNotFound(true);
		}
		setLoading(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="md"
		>
			<DialogTitle>{t('auth:forgot-pwd.dialog-title')}</DialogTitle>
			<DialogContent>
				<Stack spacing={3} mt={1}>
					<DialogContentText id="alert-dialog-description">
						{t('auth:forgot-pwd.dialog-content')}
					</DialogContentText>
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
				</Stack>
				<Box mt={1}>
					{userNotFound && (
						<Alert severity="error" onClose={() => setUserNotFound(false)}>
							{t('formErrors.userNotFound')}
						</Alert>
					)}
					{successAlert && (
						<Alert severity="success">{t('auth:alert.link-sent')}</Alert>
					)}
					{failAlert && (
						<Alert severity="error" onClose={() => setFailAlert(false)}>
							{t('formErrors.unexpectedErrorMsg')}
						</Alert>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				{successAlert ? (
					<Button onClick={handleClose}>{t('button.close')}</Button>
				) : (
					<>
						<Button onClick={handleClose}>{t('button.cancel')}</Button>
						{loading ? (
							<Button disabled>
								<CircularProgress size="2rem" />
							</Button>
						) : (
							<Button
								onClick={() => {
									if (isInputValid()) {
										setLoading(true);
										handleSend();
									}
								}}
							>
								{t('button.send')}
							</Button>
						)}
					</>
				)}
			</DialogActions>
		</Dialog>
	);
}
