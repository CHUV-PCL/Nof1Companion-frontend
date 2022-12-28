import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContextType, useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {
	deleteNof1Test,
	listOfTests,
} from '../utils/nof1-lib/api-calls/apiNof1Tests';
import { updatePhysician } from '../utils/nof1-lib/api-calls/apiPhysicians';
import { Nof1Test } from '../entities/nof1Test';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Nof1Table from '../components/nof1List/Nof1Table';
import { HeadCell } from '../components/common/table/EnhancedTableHead';
import FailSnackbar from '../components/common/ui/FailSnackbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import dayjs from 'dayjs';

/**
 * Context method to remove a test from the user.
 */
export const RemoveTestCB = createContext<
	(
		testId: string,
		userContext: UserContextType,
		setUserContext: (userCtx: UserContextType) => void,
	) => void
>(() => {});

export interface Nof1TableInterface {
	id: string;
	creationDate: Date;
	status: string;
}

/**
 * Page listing all user's N-of-1 tests.
 */
export default function Nof1() {
	const { t } = useTranslation('nof1List');
	const router = useRouter();
	const { userContext } = useUserContext();
	const [data, setData] = useState<Nof1Test[]>([]);
	const [openDialogBtn, setOpenDialogBtn] = useState(false);
	const [openFailSB, setOpenFailSB] = useState(false);
	const [loading, setLoading] = useState(true);

	// fetch N-of-1 tests.
	useEffect(() => {
		async function fetchTests(ids: string[]) {
			const { response } = await listOfTests(userContext.access_token, { ids });
			setData(response);
			setLoading(false);
		}
		const testsIds = userContext.user?.tests;
		if (testsIds && testsIds.length > 0) {
			fetchTests(testsIds);
		} else {
			setLoading(false);
		}
	}, [userContext]);

	/**
	 * Removes a test from the user tests array.
	 * @param testId Id of the test.
	 */
	const removeUserTest = useCallback(
		(
			testId: string,
			userContext: UserContextType,
			setUserContext: (userCtx: UserContextType) => void,
		) => {
			const user = { ...userContext.user! };
			const idx = user.tests!.findIndex((id) => id === testId);
			user.tests!.splice(idx, 1);
			// update of corresponding data
			updatePhysician(userContext.access_token, user._id!, {
				tests: user.tests,
			});
			deleteNof1Test(userContext.access_token, testId);
			setUserContext({
				access_token: userContext.access_token,
				user,
			});
			setData((prevData) => {
				return prevData.filter((t) => t.uid !== testId);
			});
		},
		[],
	);

	// headers of the table.
	const headCells: readonly HeadCell<Nof1TableInterface>[] = [
		{
			id: 'id',
			align: 'left',
			disablePadding: false,
			label: t('header.id'),
		},
		{
			id: 'creationDate',
			align: 'left',
			disablePadding: false,
			label: t('header.date'),
		},
		{
			id: 'status',
			align: 'right',
			disablePadding: false,
			label: t('header.state'),
		},
	];

	/**
	 * Generates and returns the table rows.
	 */
	const generateRows = (): Nof1TableInterface[] => {
		return data.map((test) => ({
			id: test.uid!,
			creationDate: new Date(test.meta_info.creationDate),
			status: test.status,
		}));
	};

	/**
	 * Handles the click on the create new test button.
	 */
	const handleCreateBtn = () => {
		if (creationLimitExceeded()) {
			setOpenFailSB(true);
		} else {
			router.push('/create-test');
		}
	};

	/**
	 * Handles the click on the button to create new test from another one.
	 */
	const handleCreateFromBtn = () => {
		if (creationLimitExceeded()) {
			setOpenFailSB(true);
		} else {
			setOpenDialogBtn(true);
		}
	};

	/**
	 * Limits the creation of a test to one every 15min.
	 * @returns True if limit exceeded, false otherwise.
	 */
	const creationLimitExceeded = () =>
		data.length > 0 &&
		dayjs().diff(
			dayjs(data[data.length - 1].meta_info.creationDate),
			'minute',
		) < 15;

	return (
		<AuthenticatedPage>
			<Stack justifyContent="center" alignItems="center">
				<Stack direction="row" spacing={4} mb={4}>
					<Button
						variant="contained"
						onClick={handleCreateBtn}
						disabled={loading}
					>
						{t('btn.create')}
					</Button>
					<Button
						variant="contained"
						onClick={handleCreateFromBtn}
						disabled={loading}
					>
						{t('btn.create-fromID')}
					</Button>
					<Dialog open={openDialogBtn} onClose={() => setOpenDialogBtn(false)}>
						<DialogTitle textAlign="center">
							{t('create-fromID-dialog-title')}
						</DialogTitle>
						<DialogContent>
							<Stack alignItems="center" spacing={2}>
								{userContext.user?.tests?.map((testId) => (
									<Link
										key={testId}
										href={{
											pathname: '/create-test',
											query: { id: testId, edit: false },
										}}
									>
										{testId}
									</Link>
								))}
							</Stack>
						</DialogContent>
					</Dialog>
				</Stack>
				<RemoveTestCB.Provider value={removeUserTest}>
					<Nof1Table
						rows={generateRows()}
						headCells={headCells}
						data={data}
						loading={userContext.user?.tests?.length !== 0 && data.length === 0}
					/>
				</RemoveTestCB.Provider>
			</Stack>
			<FailSnackbar
				open={openFailSB}
				setOpen={setOpenFailSB}
				msg={t('creation-warning')}
			/>
		</AuthenticatedPage>
	);
}
