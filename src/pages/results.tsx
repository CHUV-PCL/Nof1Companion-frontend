import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test, TestStatus } from '../entities/nof1Test';
import { TestData } from '../entities/nof1Data';
import { VariableType } from '../entities/variable';
import { findNof1Data } from '../utils/nof1-lib/api-calls/apiNof1Data';
import { findNof1TestById } from '../utils/nof1-lib/api-calls/apiNof1Tests';
import {
	anonymousXML,
	clearXML,
	encryptedXML,
} from '../utils/nof1-lib/api-calls/apiXML';
import { formatPatientDataToTable } from '../utils/nof1-lib/lib';
import ExtendedLineChart from '../components/results/lineChart';
import RecapModal from '../components/nof1List/recapModal';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import AdministrationTable from '../components/results/AdministrationTable';
import PatientDataTable from '../components/results/PatientDataTable';
import SelectedPosologies from '../components/results/SelectedPosologies';
import Statistics from '../components/results/statistics';
import { SectionCard } from '../components/common/ui';
import FailSnackbar from '../components/common/ui/FailSnackbar';
import MenuContainer from '../components/common/MenuContainer';
import { useRenderStrategy } from '../hooks/randomStrategy';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

// Custom Typography component.
const BoxedTxt = styled(Typography)<TypographyProps>(({ theme }) => ({
	border: '1px solid black',
	padding: theme.spacing(1),
	textAlign: 'center',
}));

/**
 * Results page.
 */
export default function Results() {
	const { t } = useTranslation('results');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [test, setTest] = useState<Nof1Test | null>(null);
	const [testData, setTestData] = useState<TestData | null>(null);
	const [openRecapModal, setOpenRecapModal] = useState(false);
	const [openReportModal, setOpenReportModal] = useState(false);
	const [openFailSB, setOpenFailSB] = useState(false);
	const renderStrategy = useRenderStrategy();

	// fetch N-of-1 test and patient's health variables data.
	useEffect(() => {
		async function init(id: string) {
			const { success, response } = await findNof1TestById(
				userContext.access_token,
				id,
			);
			if (!success || !userContext.user?.tests?.includes(id)) {
				await router.replace('/404');
			} else if (success && response.test) {
				const test: Nof1Test = response.test;
				// check if user can access result page
				if (dayjs() < dayjs(test.endingDate)) {
					await router.replace('/nof1');
				} else {
					const { nof1Data } = await findNof1Data(userContext.access_token, id);
					setTest(test);
					if (nof1Data) setTestData(nof1Data.data);
				}
			}
		}

		const { id } = router.query;
		if (id && userContext.access_token) {
			init(id as string);
		}
	}, [router, userContext]);

	const xmlBtnOptions = [
		{
			name: t('btn.xml-clear'),
			callback: () => {
				handleXML(clearXML);
			},
		},
		{
			name: t('btn.xml-anonymous'),
			callback: () => {
				handleXML(anonymousXML);
			},
		},
		{
			name: t('btn.xml-encrypted'),
			callback: () => {
				handleXML(encryptedXML);
			},
		},
	];

	/**
	 * Handles the XML file download.
	 * @param fetchXML API fetch method to retrieve the appropriate XML string.
	 */
	const handleXML = async (
		fetchXML: (
			token: string,
			testId: string,
		) => Promise<{
			success: boolean;
			response: any;
		}>,
	) => {
		if (test && testData) {
			const { response } = await fetchXML(userContext.access_token, test.uid!);
			const dl = document.createElement('a');
			dl.href = URL.createObjectURL(
				new Blob([response.xml], {
					type: 'text/plain',
				}),
			);
			dl.download = 'nof1.xml';
			dl.click();
		} else {
			setOpenFailSB(true);
		}
	};

	/**
	 * Retrieve the administration schema of the N-of-1 test.
	 * @param test N-of-1 test.
	 * @returns The administration schema.
	 */
	const getAdministrationSchema = (test: Nof1Test) => {
		if (test.status === TestStatus.Interrupted) {
			const days =
				dayjs(test.endingDate).diff(dayjs(test.beginningDate), 'day') + 1;
			return test.administrationSchema!.slice(0, days);
		}
		return test.administrationSchema!;
	};

	return (
		<AuthenticatedPage>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="center"
				spacing={{ xs: 1, sm: 5 }}
				mb={4}
			>
				<Button
					variant="contained"
					onClick={() => {
						router.push({
							pathname: '/import-data',
							query: { id: router.query.id },
						});
					}}
					disabled={test === null}
				>
					{t('btn.dataImport')}
				</Button>
				<Button
					variant="contained"
					onClick={() => setOpenRecapModal(true)}
					disabled={test === null}
				>
					{t('btn.recap-modal')}
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						if (testData) {
							setOpenReportModal(true);
						} else {
							setOpenFailSB(true);
						}
					}}
					disabled={test === null}
				>
					{t('btn.report')}
				</Button>
				<MenuContainer name={t('btn.xml')} items={xmlBtnOptions} />
			</Stack>

			<SectionCard>
				<Stack spacing={3}>
					<Typography variant="h4" textAlign="center">
						{t('title.main')}
					</Typography>
					<Typography variant="h6">
						{t('title.testID', { testID: router.query.id })}
					</Typography>
					{test ? (
						<>
							<div>
								<Typography>
									{t('common:startingDate')}
									{': '}
									{dayjs(test.beginningDate).toDate().toLocaleDateString()}
								</Typography>
								<Typography>
									{t('common:endingDate')}
									{': '}
									{dayjs(test.endingDate).toDate().toLocaleDateString()}
								</Typography>
								{test.status === TestStatus.Interrupted && (
									<Typography fontStyle="italic">{t('interrupted')}</Typography>
								)}
							</div>

							<Typography variant="h5">{t('title.random-sub-seq')}</Typography>
							<Stack direction="row">
								{test.substancesSequence!.map((abbrev, idx) => (
									<div key={idx}>
										<BoxedTxt>
											{t('common:period')} {idx + 1}
										</BoxedTxt>
										<BoxedTxt>{abbrev}</BoxedTxt>
									</div>
								))}
							</Stack>
							<div>
								<Typography>
									{t('period-duration')} {test.periodLen} {t('common:days')}.
								</Typography>
								<Typography>
									{t('randomStrategy')} {renderStrategy(test.randomization)}
								</Typography>
							</div>

							<SelectedPosologies substances={test.substances} />

							<Typography variant="h5">{t('title.admin-schema')}</Typography>
							<Paper>
								<AdministrationTable
									administrationSchema={getAdministrationSchema(test)}
									startDate={test.beginningDate!}
								/>
							</Paper>

							<Typography variant="h5">{t('title.patient-data')}</Typography>
							{testData ? (
								<Paper>
									<PatientDataTable
										data={formatPatientDataToTable(
											testData,
											test.meta_info.showPeriodQuestions,
										)}
										variables={test.monitoredVariables}
										showPeriodQuestions={test.meta_info.showPeriodQuestions}
									/>
								</Paper>
							) : (
								<Typography>{t('no-data')}</Typography>
							)}

							<Typography variant="h5">{t('title.graph')}</Typography>
							{testData ? (
								test.monitoredVariables
									.filter(
										(v) =>
											v.type === VariableType.Numeric ||
											v.type === VariableType.VAS,
									)
									.map((v) => (
										<ExtendedLineChart
											key={v.name}
											testData={testData}
											variable={v}
											periodLen={test.periodLen}
											substances={test.substances}
											substancesSeq={test.substancesSequence!}
										/>
									))
							) : (
								<Typography>{t('no-data')}</Typography>
							)}

							<Typography variant="h5">{t('title.statistics')}</Typography>
							{testData ? (
								<Statistics
									test={test}
									testData={testData}
									openReport={openReportModal}
									closeReport={() => setOpenReportModal(false)}
								/>
							) : (
								<Typography>{t('no-data')}</Typography>
							)}
						</>
					) : (
						<Skeleton
							variant="rectangular"
							animation="wave"
							width={'100%'}
							height={'42vh'}
						/>
					)}
				</Stack>
			</SectionCard>
			{test && (
				<>
					<RecapModal
						open={openRecapModal}
						setOpen={setOpenRecapModal}
						item={test}
					/>
				</>
			)}
			<FailSnackbar
				open={openFailSB}
				setOpen={setOpenFailSB}
				msg={t('no-data')}
			/>
		</AuthenticatedPage>
	);
}
