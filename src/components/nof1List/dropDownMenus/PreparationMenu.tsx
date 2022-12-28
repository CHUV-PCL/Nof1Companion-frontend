import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import MenuOptions from './MenuOptions';
import HealthLogbookModal from '../HealthLogbookModal';
import { Nof1Test } from '../../../entities/nof1Test';

interface PreparationMenuProps {
	item: Nof1Test;
}

/**
 * Options menu for a test with the status Preparation.
 */
export default function PreparationMenu({ item }: PreparationMenuProps) {
	const { t } = useTranslation('nof1List');
	const [openLogbookModal, setOpenLogbookModal] = useState(false);

	const menuItems = [
		{
			name: t('menu.varBooklet-preview'),
			tooltipText: t('menu.varBooklet-preview-info'),
			callback: () => {
				setOpenLogbookModal(true);
			},
		},
	];

	return (
		<>
			<MenuOptions name={t('optionsMenu')} items={menuItems} test={item} />
			<HealthLogbookModal
				open={openLogbookModal}
				handleClose={() => setOpenLogbookModal(false)}
				item={item}
			/>
		</>
	);
}
