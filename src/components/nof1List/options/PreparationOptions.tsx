import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useUserContext } from '../../../context/UserContext';
import { Nof1Test, TestStatus } from '../../../entities/nof1Test';
import { updateNof1Test } from '../../../utils/nof1-lib/api-calls/apiNof1Tests';
import {
	generateAdministrationSchema,
	generateSequence,
	selectRandomPosology,
	sendPharmaEmailWrapper,
} from '../../../utils/nof1-lib/lib';
import { usePharmaEmailInfos } from '../../../hooks/email';
import OptionBtn from './OptionBtn';
import { OptionsProps } from '../Nof1TableItem';
import EmailConfirmDialog from '../EmailConfirmDialog';
import PreparationMenu from '../dropDownMenus/PreparationMenu';
import FailSnackbar from '../../common/ui/FailSnackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

interface PreparationOptionsProps extends OptionsProps {
	setItem: Dispatch<SetStateAction<Nof1Test>>;
}

/**
 * Component rendering the options for a test with the status ready.
 */
export default function PreparationOptions({
	item,
	setItem,
}: PreparationOptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [sendingEmail, setSendingEmail] = useState(false);
	const [openEmailDialog, setOpenEmailDialog] = useState(false);
	const [openEmailFailSB, setOpenEmailFailSB] = useState(false);
	const {
		schemaHeaders,
		patientInfos,
		physicianInfos,
		nof1PhysicianInfos,
		msg,
		recapTxt,
		comments,
		emailSubject,
	} = usePharmaEmailInfos(
		item.participants.patient,
		item.participants.requestingPhysician,
		item.participants.nof1Physician,
	);

	/**
	 * Triggers the generation of the randomized parameters of the test.
	 * @param email Confirmed pharmacy email address.
	 * @returns The updated test.
	 */
	const updateTest = (email: string) => {
		const test = { ...item };
		test.substances.forEach(
			(s) => (s.posology = selectRandomPosology(test.posologies, s.name)),
		);
		test.substancesSequence = generateSequence(
			test.substances,
			test.randomization,
			test.nbPeriods,
		);
		test.administrationSchema = generateAdministrationSchema(
			test.substances,
			test.substancesSequence,
			test.periodLen,
			test.nbPeriods,
		);
		test.participants.pharmacy.email = email;
		return test;
	};

	/**
	 * Sends an email to the pharmacy and updates the test's information.
	 * @param test N-of-1 test information.
	 */
	const sendEmail = async (test: Nof1Test) => {
		const response = await sendPharmaEmailWrapper(
			test,
			userContext.access_token,
			patientInfos,
			physicianInfos,
			nof1PhysicianInfos,
			schemaHeaders,
			comments,
			recapTxt,
			[t('common:xlsx.decreasing-dosage-info')],
			msg,
			emailSubject,
		);

		if (response.success) {
			test.meta_info.emailSendingDate = new Date();
			test.status = TestStatus.Ready;
			updateNof1Test(userContext.access_token, test.uid!, test);
			setItem(test); // update display
		} else {
			setOpenEmailFailSB(true);
		}
		setSendingEmail((prevState) => !prevState);
	};

	/**
	 * Handles click on the edit button.
	 */
	const handleEdit = () => {
		router.push({
			pathname: '/create-test',
			query: { id: item.uid, edit: true },
		});
	};

	/**
	 * Handles the submission of the email confirmation dialog.
	 * Updates the test information and sends the email to the pharmacy.
	 * @email Confirmed email.
	 */
	const handleEmailDialogSubmit = (email: string) => {
		setSendingEmail((prevState) => !prevState);
		const test = updateTest(email);
		sendEmail(test);
	};

	return (
		<>
			{sendingEmail ? (
				<OptionBtn disabled>
					<CircularProgress size="2em" />
				</OptionBtn>
			) : (
				<OptionBtn
					onClick={() => setOpenEmailDialog(true)}
					tooltipText={t('btnStatus.preparation-info')}
					width={275}
				>
					{t('btnStatus.preparation')}
				</OptionBtn>
			)}
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn variant="outlined" onClick={handleEdit}>
					{t('btn.edit')}
				</OptionBtn>
				<PreparationMenu item={item} />
			</Stack>
			<EmailConfirmDialog
				open={openEmailDialog}
				handleClose={() => setOpenEmailDialog(false)}
				handleDialogSubmit={(email) => handleEmailDialogSubmit(email)}
				email={item.participants.pharmacy.email}
			/>
			<FailSnackbar
				open={openEmailFailSB}
				setOpen={setOpenEmailFailSB}
				msg={t('alert.email')}
			/>
		</>
	);
}
