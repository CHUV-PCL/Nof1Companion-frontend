import { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import EndedOptions from './options/EndedOptions';
import ReadyOptions from './options/ReadyOptions';
import OngoingOptions from './options/OngoingOptions';
import DraftOptions from './options/DraftOptions';
import PreparationOptions from './options/PreparationOptions';
import { Nof1Test, TestStatus } from '../../entities/nof1Test';

interface TableItemProps {
	item: Nof1Test;
	labelId: string;
}

export interface OptionsProps {
	item: Nof1Test;
}

/**
 * Nof1 table item component. Renders the options according to the test status.
 */
export default function Nof1TableItem({ item, labelId }: TableItemProps) {
	const [test, setTest] = useState<Nof1Test>(item);

	/**
	 * @returns The appropriate component according to the test status.
	 */
	const content = () => {
		switch (test.status) {
			case TestStatus.Draft:
				return <DraftOptions item={test} />;
			case TestStatus.Ended:
			case TestStatus.Interrupted:
				return <EndedOptions item={test} />;
			case TestStatus.Ongoing:
				return <OngoingOptions item={test} setItem={setTest} />;
			case TestStatus.Ready:
				return <ReadyOptions item={test} setItem={setTest} />;
			case TestStatus.Preparation:
				return <PreparationOptions item={test} setItem={setTest} />;
		}
	};

	return (
		<TableRow tabIndex={-1} sx={{ height: 125 }}>
			<TableCell id={labelId} scope="row">
				{test.uid}
			</TableCell>
			<TableCell id={`${labelId}-date`} scope="row" align="center">
				{new Date(test.meta_info.creationDate).toLocaleDateString()}
			</TableCell>
			<TableCell align="right">
				<Stack justifyContent="center" alignItems="flex-end" spacing={2}>
					{content()}
				</Stack>
			</TableCell>
		</TableRow>
	);
}
