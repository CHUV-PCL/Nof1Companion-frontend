import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { AdministrationSchema } from '../../entities/nof1Test';
import ReadOnlyTableWPages from '../common/table/ReadOnlyTableWPages';
import CustomTooltip from '../common/ui/CustomTooltip';
import ExportToolbar from '../../components/results/ExportToolbar';
import dayjs from 'dayjs';

/**
 * Generate the row of the administration schema table.
 * @param schema Administration schema.
 * @param startDate Test start date.
 * @returns The formatted array.
 */
const generateRows = (schema: AdministrationSchema, startDate: Date) => {
	return schema.map((row) => [
		dayjs(startDate).add(row.day, 'day').toDate().toLocaleDateString(),
		row.substance,
		row.unit,
		row.morning.toString(),
		row.morningFraction.toString(),
		row.noon.toString(),
		row.noonFraction.toString(),
		row.evening.toString(),
		row.eveningFraction.toString(),
		row.night.toString(),
		row.nightFraction.toString(),
	]);
};

interface Props {
	administrationSchema: AdministrationSchema;
	startDate: Date;
}

/**
 * Table component to display the administration schema.
 */
export default function AdministrationTable({
	administrationSchema,
	startDate,
}: Props) {
	const { t } = useTranslation('common');
	const headers0 = [
		{ name: '', colspan: 3 },
		{ name: t('posology-table.morning'), colspan: 2 },
		{ name: t('posology-table.noon'), colspan: 2 },
		{ name: t('posology-table.evening'), colspan: 2 },
		{ name: t('posology-table.night'), colspan: 2 },
	];
	const dosage = [
		t('posology-table.dose-w/o-unit'),
		t('posology-table.fraction'),
	];
	const headers = [
		t('date'),
		t('substance'),
		t('posology-table.unit'),
		...dosage,
		...dosage,
		...dosage,
		...dosage,
	];
	const xlsxHeaders = [
		[
			'',
			'',
			'',
			t('posology-table.morning'),
			'',
			t('posology-table.noon'),
			'',
			t('posology-table.evening'),
			'',
			t('posology-table.night'),
		],
		headers,
	];
	// filename of the XLSX export. Max length = 31 chars
	const filename = t('results:xlsx.file-admin-schema');

	return (
		<>
			<ExportToolbar
				data={{
					filename,
					rows: generateRows(administrationSchema, startDate),
					headers: xlsxHeaders,
				}}
				info={
					<Typography fontStyle="italic">
						{t('posology-table.fraction-info')}{' '}
						<CustomTooltip infoText={t('posology-table.fraction-desc')} />
					</Typography>
				}
			/>
			<ReadOnlyTableWPages
				headers0={headers0}
				headers={headers}
				rows={generateRows(administrationSchema, startDate)}
				emptyCellHeight={33}
			/>
		</>
	);
}
