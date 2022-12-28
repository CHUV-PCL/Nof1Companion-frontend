import { Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useUserContext } from '../../../context/UserContext';
import { updateNof1Test } from '../../../utils/nof1-lib/api-calls/apiNof1Tests';
import { Nof1Test, TestStatus } from '../../../entities/nof1Test';
import OptionBtn from './OptionBtn';
import { OptionsProps } from '../Nof1TableItem';
import OngoingMenu from '../dropDownMenus/OngoingMenu';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

interface OngoingOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ongoing.
 */
export default function OngoingOptions({ item, setItem }: OngoingOptionsProps) {
	const { t } = useTranslation('nof1List');
	const { userContext } = useUserContext();
	const router = useRouter();

	// check on rendering if the date deadline is exceeded.
	useEffect(() => {
		if (dayjs() >= dayjs(item.endingDate!)) {
			const test = { ...item };
			test.status = TestStatus.Ended;
			updateNof1Test(userContext.access_token, item.uid!, {
				status: TestStatus.Ended,
			});
			setItem(test);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Handle click on the stop button.
	 */
	const handleStop = () => {
		const test = { ...item };
		test.endingDate = new Date();
		test.status = TestStatus.Interrupted;
		updateNof1Test(userContext.access_token, item.uid!, {
			endingDate: test.endingDate,
			status: test.status,
		});
		setItem(test);
	};

	return (
		<>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn
					color="error"
					tooltipText={t('btn.stop-info')}
					onClick={handleStop}
				>
					{t('btn.stop')}
				</OptionBtn>
				<OptionBtn disabled>{t('btnStatus.ongoing')}</OptionBtn>
			</Stack>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn
					variant="outlined"
					width={310}
					onClick={() => {
						router.push({
							pathname: '/import-data',
							query: { id: item.uid },
						});
					}}
				>
					{t('menu.dataImport')}
				</OptionBtn>
				<OngoingMenu item={item} />
			</Stack>
		</>
	);
}
