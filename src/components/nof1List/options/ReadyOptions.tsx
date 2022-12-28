import { Dispatch, SetStateAction, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import { tokenExpMargin } from '../../../utils/constants';
import { updateNof1Test } from '../../../utils/nof1-lib/api-calls/apiNof1Tests';
import { sendPatientEmail } from '../../../utils/nof1-lib/api-calls/apiEmail';
import { usePatientEmailMsg } from '../../../hooks/email';
import { Nof1Test, TestStatus } from '../../../entities/nof1Test';
import { OptionsProps } from '../Nof1TableItem';
import OptionBtn from './OptionBtn';
import EmailConfirmDialog from '../EmailConfirmDialog';
import ReadyMenu from '../dropDownMenus/ReadyMenu';
import DatePicker from '../../common/DatePicker';
import FailSnackbar from '../../common/ui/FailSnackbar';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';

interface ReadyOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ready.
 */
export default function ReadyOptions({ item, setItem }: ReadyOptionsProps) {
	const { t, lang } = useTranslation('nof1List');
	const { userContext } = useUserContext();
	const [beginningDate, setBeginningDate] = useState<dayjs.Dayjs | null>(null);
	const [sendingEmail, setSendingEmail] = useState(false);
	const [openDateSnackbar, setOpenDateSnackbar] = useState(false);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [openEmailFailSnackbar, setOpenEmailFailSnackbar] = useState(false);

	const endingDate = beginningDate
		?.add(item.periodLen * item.nbPeriods - 1, 'day')
		.toDate();

	const patientEmailMsg = usePatientEmailMsg(
		`${
			process.env.NEXT_PUBLIC_APP_URL
		}/${lang}/import-data/patient?id=${item.uid!}&token=TOKEN`,
		item.participants.nof1Physician,
		dayjs(beginningDate).toDate().toLocaleDateString(),
		dayjs(endingDate).add(tokenExpMargin, 'day').toDate().toLocaleDateString(),
	);

	/**
	 * Updates the test information.
	 * @param email Patient email address.
	 * @returns The updated test.
	 */
	const updateTest = (email: string) => {
		const test = { ...item };
		test.beginningDate = beginningDate!.toDate();
		test.endingDate = endingDate;
		test.status = TestStatus.Ongoing;
		test.participants.patient.email = email;
		return test;
	};

	/**
	 * Sends an email to the patient and updates the test's information.
	 * @param test N-of-1 test information.
	 */
	const sendEmail = async (test: Nof1Test) => {
		const tokenExp = dayjs(test.endingDate)
			.startOf('day')
			.add(tokenExpMargin, 'day')
			.unix();
		const notBefore = dayjs(test.beginningDate).startOf('day').unix();
		const response = await sendPatientEmail(
			userContext.access_token,
			patientEmailMsg,
			test.participants.patient.email,
			t('mail:patient.subject'),
			tokenExp,
			notBefore,
		);

		if (response.success) {
			updateNof1Test(userContext.access_token, test.uid!, test);
			setItem(test); // update display
		} else {
			setOpenEmailFailSnackbar(true);
		}
		setSendingEmail((prevState) => !prevState);
	};

	/**
	 * Handles click on start button, triggering the email confirmation dialog
	 * if a date is set, otherwise opens a warning snackbar informing that a
	 * date must be set.
	 */
	const handleReady = () => {
		if (
			beginningDate
			// If we want to prevent the selection of an earlier date :
			// beginningDate &&
			// beginningDate.startOf('day') >= dayjs().startOf('day')
		) {
			setOpenEmailDialog(true);
		} else {
			setOpenDateSnackbar(true);
		}
	};

	/**
	 * Handles the email confirmation dialog submission, triggering the test's
	 * information update and sending the e-mail to the patient.
	 */
	const handleDialogSubmit = (email: string) => {
		setSendingEmail((prevState) => !prevState);
		const test = updateTest(email);
		sendEmail(test);
	};

	return (
		<>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<DatePicker value={beginningDate} setValue={setBeginningDate} />
				{sendingEmail ? (
					<OptionBtn disabled>
						<CircularProgress size="2em" />
					</OptionBtn>
				) : (
					<OptionBtn
						tooltipText={t('btnStatus.ready-info')}
						onClick={handleReady}
					>
						{t('btnStatus.ready')}
					</OptionBtn>
				)}
			</Stack>
			<ReadyMenu item={item} />
			<EmailConfirmDialog
				open={openEmailDialog}
				handleClose={() => setOpenEmailDialog(false)}
				handleDialogSubmit={(email) => handleDialogSubmit(email)}
				email={item.participants.patient.email}
			/>
			<FailSnackbar
				open={openDateSnackbar}
				setOpen={setOpenDateSnackbar}
				msg={t('alert.date')}
			/>
			<FailSnackbar
				open={openEmailFailSnackbar}
				setOpen={setOpenEmailFailSnackbar}
				msg={t('alert.email')}
			/>
		</>
	);
}
