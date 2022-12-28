import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { RemoveTestCB } from '../../../pages/nof1';
import { OptionsProps } from '../Nof1TableItem';

/**
 * Component rendering the options for a test with the status draft.
 */
export default function DraftOptions({ item }: OptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext, setUserContext } = useUserContext();
	const removeItem = useContext(RemoveTestCB);

	/**
	 * Handles click on the button to continue editing the test.
	 */
	const handleDraft = () => {
		router.push({
			pathname: '/create-test',
			query: { id: item.uid, edit: true },
		});
	};

	/**
	 * Handles click on the delete button.
	 */
	const handleDelete = () => {
		removeItem(item.uid!, userContext, setUserContext);
	};

	return (
		<Stack direction="row" spacing={3}>
			<Button variant="contained" color="error" onClick={handleDelete}>
				{t('btn.delete')}
			</Button>
			<Button variant="contained" onClick={handleDraft}>
				{t('btnStatus.draft')}
			</Button>
		</Stack>
	);
}
