import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import {
	defaultPatient,
	defaultPharmacy,
	defaultPhysician,
} from '../entities/people';
import { Nof1Test, IParticipants, TestStatus } from '../entities/nof1Test';
import { Variable } from '../entities/variable';
import { SubstancePosologies } from '../entities/posology';
import { Substance, emptySubstance } from '../entities/substance';
import { defaultClinicalInfo, IClinicalInfo } from '../entities/clinicalInfo';
import { maxValue } from '../utils/constants';
import {
	RandomizationStrategy,
	RandomStrategy,
} from '../utils/nof1-lib/randomizationStrategy';
import {
	createNof1Test,
	findNof1TestById,
	updateNof1Test,
} from '../utils/nof1-lib/api-calls/apiNof1Tests';
import { updatePhysician } from '../utils/nof1-lib/api-calls/apiPhysicians';
import { AnalyseType } from '../utils/statistics';
import TestParameters from '../components/testCreation/parameters';
import Variables from '../components/testCreation/variables';
import ClinicalInfo from '../components/testCreation/clinicalInfo';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Participants from '../components/testCreation/participants';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import isEqual from 'lodash.isequal';

/**
 * N-of-1 test creation page.
 */
export default function CreateTest() {
	const { t } = useTranslation('createTest');
	const { userContext, setUserContext } = useUserContext();
	const router = useRouter();
	const [incompleteForm, setIncompleteForm] = useState(false);
	const [draftError, setDraftError] = useState(false);

	// Test data. Using Ref to avoid countless re-renders.
	const participants = useRef<IParticipants>({
		patient: defaultPatient(),
		requestingPhysician: defaultPhysician(),
		nof1Physician: userContext.user!,
		pharmacy: defaultPharmacy(),
	});
	const [substances, setSubstances] = useState<Substance[]>([
		{ ...emptySubstance },
		{ ...emptySubstance },
	]);
	const [nbPeriods, setNbPeriods] = useState(6);
	const [periodLen, setPeriodLen] = useState(7);
	const [strategy, setStrategy] = useState<RandomizationStrategy>({
		strategy: RandomStrategy.Permutations,
	});
	const [variables, setVariables] = useState<Variable[]>([]);
	const [allPosologies, setAllPosologies] = useState<SubstancePosologies[]>([]);
	const [loading, setLoading] = useState(true);
	const [clinicalInfo, setClinicalInfo] = useState<IClinicalInfo>(
		defaultClinicalInfo(),
	);
	const [analysisToPerform, setAnalysisToPerform] = useState(
		AnalyseType.CycleANOVA,
	);
	const [showPeriodQuestions, setShowPeriodQuestions] = useState(true);
	const [creationDate, setCreationDate] = useState(new Date());

	// fills parameters in case of test edit or "new from template"
	useEffect(() => {
		async function fetchData(id: string, edit: string) {
			const { success, response } = await findNof1TestById(
				userContext.access_token,
				id,
			);
			if (!success || !userContext.user?.tests?.includes(id)) {
				await router.replace('/404');
			} else if (success && response.test) {
				const test: Nof1Test = response.test;
				participants.current = {
					...test.participants,
					nof1Physician: userContext.user!,
				};
				setClinicalInfo(test.clinicalInfo);
				setSubstances(
					test.substances.map((s) => {
						const { posology, decreasingDosage, ...rest } = s;
						if (edit === 'true') {
							return { ...rest, decreasingDosage };
						}
						return rest;
					}),
				);
				setNbPeriods(test.nbPeriods);
				setPeriodLen(test.periodLen);
				setStrategy(test.randomization);
				setAnalysisToPerform(test.statistics.analysisToPerform);
				setVariables(test.monitoredVariables);
				setShowPeriodQuestions(test.meta_info.showPeriodQuestions);
				if (edit === 'true') {
					setAllPosologies(test.posologies);
					setCreationDate(test.meta_info.creationDate);
				}
				setLoading(false);
			}
		}

		if (router.isReady && userContext.access_token && userContext.user) {
			const { id, edit } = router.query;
			if (id) {
				fetchData(id as string, edit as string);
			} else {
				participants.current.nof1Physician = userContext.user; // in case of a page refresh
				setLoading(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, userContext]);

	// to fix scroll going to the middle of page when editing or creating from template
	useEffect(() => {
		const timer = setTimeout(
			() =>
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				}),
			2,
		);
		return () => clearTimeout(timer);
	}, [loading]);

	/**
	 * Updates a user tests array with the newly created one.
	 * @param testId Id of the newly created test.
	 */
	const updateUserTests = (testId: string) => {
		const user = { ...userContext.user! };
		if (user.tests === undefined || user.tests.length === 0) {
			user.tests = [testId];
		} else {
			user.tests = [...user.tests, testId];
		}
		updatePhysician(userContext.access_token, user._id!, { tests: user.tests });
		setUserContext({
			access_token: userContext.access_token,
			user,
		});
	};

	/**
	 * Generates a N-of-1 test from the component data.
	 * @returns A N-of-1 test object, without the status field.
	 */
	const generateNof1TestData = (): Omit<Nof1Test, 'status'> => {
		return {
			participants: participants.current,
			clinicalInfo,
			nbPeriods,
			periodLen,
			randomization: strategy,
			substances,
			posologies: allPosologies,
			monitoredVariables: variables,
			statistics: { analysisToPerform },
			meta_info: { creationDate, showPeriodQuestions },
		};
	};

	/**
	 * Creates or updates a N-of-1 test according to the query parameters.
	 * @param testData N-of-1 test.
	 */
	const createOrUpdateNof1 = async (testData: Nof1Test) => {
		const { id, edit } = router.query;
		if (edit && edit === 'true') {
			updateNof1Test(userContext.access_token, id! as string, testData);
		} else {
			const { success, response } = await createNof1Test(
				userContext.access_token,
				testData,
			);
			if (success) {
				updateUserTests(response.id);
			}
		}
		router.push('/nof1');
	};

	/**
	 * Checks if substances are filled in.
	 */
	const substancesNotFilledIn = useMemo(
		() =>
			substances.length < 2 ||
			substances.some(
				(e) =>
					e.name === emptySubstance.name ||
					e.abbreviation === emptySubstance.abbreviation ||
					e.unit === emptySubstance.unit,
			),
		[substances],
	);

	/**
	 * Checks if participants are filled in.
	 */
	const participantsNotFilledIn = () =>
		isEqual(participants.current.patient, defaultPatient()) ||
		isEqual(participants.current.pharmacy, defaultPharmacy()) ||
		isEqual(participants.current.requestingPhysician, defaultPhysician()) ||
		isEqual(participants.current.attendingPhysician, defaultPhysician());
	// mutable values doesn't trigger a render, thus as
	// a function call and without useMemo.

	/**
	 * Checks if the predefined sequence is correct, in case of custom sequence strategy.
	 */
	const sequenceError =
		strategy.predefinedSeq !== undefined &&
		!(
			strategy.predefinedSeq.length === nbPeriods &&
			strategy.predefinedSeq.every((s) =>
				substances.map((sub) => sub.abbreviation).includes(s),
			)
		);

	/**
	 * Handles the button's click to create a new test.
	 * Checks if required inputs are filled in correctly.
	 */
	const handleCreation = () => {
		if (
			participantsNotFilledIn() ||
			nbPeriods > maxValue ||
			periodLen > maxValue ||
			variables.length === 0 ||
			substancesNotFilledIn ||
			allPosologies.length === 0 ||
			(strategy.strategy === RandomStrategy.Custom && sequenceError)
		) {
			setIncompleteForm(true);
		} else {
			const testData: Nof1Test = {
				status: TestStatus.Preparation,
				...generateNof1TestData(),
			};
			createOrUpdateNof1(testData);
		}
	};

	/**
	 * Handles the button's click to create a new draft test.
	 */
	const handleDraft = () => {
		if (participantsNotFilledIn()) {
			setDraftError(true);
		} else {
			const testData: Nof1Test = {
				status: TestStatus.Draft,
				...generateNof1TestData(),
			};
			createOrUpdateNof1(testData);
		}
	};

	if (loading) {
		return (
			<AuthenticatedPage>
				<Skeleton
					variant="rectangular"
					animation="wave"
					width={'100%'}
					height={'80vh'}
				/>
			</AuthenticatedPage>
		);
	}

	return (
		<AuthenticatedPage>
			<Stack spacing={3}>
				<Stack
					alignItems="center"
					position="sticky"
					top={0}
					bgcolor="background.default"
					zIndex={2}
				>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						justifyContent="center"
						spacing={{ xs: 1, sm: 6 }}
						paddingY={1}
					>
						<Button variant="contained" onClick={handleDraft}>
							{t('draftBtn')}
						</Button>
						<Button variant="contained" onClick={handleCreation}>
							{t('createBtn')}
						</Button>
					</Stack>
					{incompleteForm && (
						<Alert
							severity="error"
							onClose={() => setIncompleteForm((prevState) => !prevState)}
						>
							{t('create-error')}
						</Alert>
					)}
					{draftError && (
						<Alert
							severity="error"
							onClose={() => setDraftError((prevState) => !prevState)}
						>
							{t('draft-error')}
						</Alert>
					)}
				</Stack>

				<Participants participants={participants} />

				<ClinicalInfo
					clinicalInfo={clinicalInfo}
					setClinicalInfo={setClinicalInfo}
					participants={participants}
				/>

				<TestParameters
					substances={substances}
					setSubstances={setSubstances}
					strategy={strategy}
					setStrategy={setStrategy}
					nbPeriods={nbPeriods}
					setNbPeriods={setNbPeriods}
					periodLen={periodLen}
					setPeriodLen={setPeriodLen}
					allPosologies={allPosologies}
					setAllPosologies={setAllPosologies}
					analysisToPerform={analysisToPerform}
					setAnalysisToPerform={setAnalysisToPerform}
				/>

				<Variables
					variables={variables}
					setVariables={setVariables}
					periodLen={periodLen}
					showPeriodQuestions={showPeriodQuestions}
					setShowPeriodQuestions={setShowPeriodQuestions}
				/>
			</Stack>
		</AuthenticatedPage>
	);
}
