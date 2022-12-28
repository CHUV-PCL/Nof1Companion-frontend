import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useTranslation from 'next-translate/useTranslation';
import { useContext } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { RemoveTestCB } from '../../../pages/nof1';

interface DeleteDialogProps {
	open: boolean;
	handleClose: () => void;
	testId: string;
}

export default function DeleteDialog({
	open,
	handleClose,
	testId,
}: DeleteDialogProps) {
	const { t } = useTranslation('nof1List');
	const { userContext, setUserContext } = useUserContext();
	const removeItem = useContext(RemoveTestCB);

	const handleSubmit = () => {
		removeItem(testId, userContext, setUserContext);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-describedby="alert-dialog-description"
		>
			<DialogContent>
				<DialogContentText
					id="alert-dialog-description"
					fontWeight="bold"
					color="black"
				>
					{t('delete-warning')}
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ paddingBottom: 2, paddingX: 2 }}>
				<Button variant="outlined" onClick={handleClose}>
					{t('common:button.cancel')}
				</Button>
				<Button variant="contained" color="error" onClick={handleSubmit}>
					{t('btn.delete')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
