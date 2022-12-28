import { useCallback } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Paper from '@mui/material/Paper';
import { TestData } from '../../../entities/nof1Data';
import { Variable } from '../../../entities/variable';
import { Substance } from '../../../entities/substance';
import { currentSubstance } from '../../../utils/charts';
import { useCurrentPng } from 'recharts-to-png';
import FileSaver from 'file-saver';
import CustomLineChart from './LineChart';

interface Props {
	testData: TestData;
	variable: Variable;
	periodLen: number;
	substances: Substance[];
	substancesSeq: string[];
}

/**
 * Line chart component, rendering a line chart for the given data.
 */
export default function ExtendedLineChart({
	testData,
	variable,
	periodLen,
	substances,
	substancesSeq,
}: Props) {
	const { t } = useTranslation('common');
	const [getPng, { ref }] = useCurrentPng();

	/**
	 * Handle click on the download button. It triggers a file save.
	 */
	const handleDownload = useCallback(async () => {
		const png = await getPng();
		if (png) {
			FileSaver.saveAs(png, `${variable.name}.png`);
		}
	}, [getPng, variable.name]);

	/**
	 * CustomTooltip component for the LineChart. Allows to display the correct information.
	 */
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			let correctPayload = payload[0];
			if (label > 1 && (label - 1) % periodLen === 0) {
				correctPayload = payload.find(
					(p: any) =>
						p.dataKey ===
						currentSubstance(label, periodLen, substancesSeq, substances),
				);
			}
			return (
				<Paper variant="outlined" sx={{ padding: 1 }}>
					<Typography>{`${t('day')} ${label}`}</Typography>
					<Typography>{`${correctPayload.dataKey} : ${correctPayload.value}`}</Typography>
				</Paper>
			);
		}
		return null;
	};

	const substancesNames = substances.map((s) => s.name);

	return (
		<Stack alignItems="center">
			<Stack width="90%" direction="row" justifyContent="space-between">
				<Typography variant="h6" fontStyle="italic" fontWeight="bold">
					{variable.name}
				</Typography>
				<Button
					onClick={handleDownload}
					endIcon={<FileDownloadOutlinedIcon />}
					sx={{ justifySelf: 'flex-end' }}
				>
					{t('button.download')}
				</Button>
			</Stack>
			<CustomLineChart
				ref={ref}
				width="90%"
				height={300}
				customTooltip={CustomTooltip}
				testData={testData}
				variable={variable}
				periodLen={periodLen}
				substancesNames={substancesNames}
			/>
		</Stack>
	);
}
