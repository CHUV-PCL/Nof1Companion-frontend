import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import RecapModal from '../recapModal';
import DeleteDialog from './DeleteDialog';
import { Nof1Test } from '../../../entities/nof1Test';
import { generateXlsxSchemaExample } from '../../../utils/nof1-lib/lib';
import { usePharmaEmailInfos } from '../../../hooks/email';
import MenuContainer, { IMenuItem } from '../../common/MenuContainer';

interface MenuOptionsProps {
	name: string;
	items: IMenuItem[];
	test: Nof1Test;
	btnSize?: number;
}

/**
 * Common Menu container component.
 */
export default function MenuOptions({
	name,
	items,
	test,
	btnSize = 220,
}: MenuOptionsProps) {
	const { t } = useTranslation('nof1List');
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		recapTxt,
		comments,
	} = usePharmaEmailInfos(
		test.participants.patient,
		test.participants.requestingPhysician,
		test.participants.nof1Physician,
	);

	const menuItems = [
		{
			name: t('menu.parameters'),
			callback: () => {
				setOpenRecapModal(true);
			},
		},
		...items,
		{
			name: t('menu.xlsx-exemple'),
			tooltipText: t('menu.xlsx-exemple-info'),
			callback: () => {
				generateXlsxSchemaExample(test, {
					patientInfos,
					physicianInfos,
					nof1PhysicianInfos,
					schemaHeaders,
					recapTxt,
					comments,
					decreasingSchemaInfo: [t('common:xlsx.decreasing-dosage-info')],
				});
			},
		},
		{
			name: t('menu.delete-test'),
			color: 'red',
			callback: () => {
				setOpenDeleteDialog(true);
			},
		},
	];

	return (
		<>
			<MenuContainer items={menuItems} name={name} btnSize={btnSize} />
			<RecapModal
				open={openRecapModal}
				setOpen={setOpenRecapModal}
				item={test}
			/>
			<DeleteDialog
				open={openDeleteDialog}
				handleClose={() => setOpenDeleteDialog(false)}
				testId={test.uid!}
			/>
		</>
	);
}
