import { MutableRefObject, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { TestData } from '../../entities/nof1Data';
import { Substance } from '../../entities/substance';
import TextareaWithCustomValidation from '../common/inputs/TextareaWithCustomValidation';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

interface PeriodQuestionsProps {
	dayIdx: number;
	testData: MutableRefObject<TestData | undefined>;
	substances: Substance[];
}

export default function PeriodQuestions({
	dayIdx,
	testData,
	substances,
}: PeriodQuestionsProps) {
	const { t } = useTranslation('importData');
	const [supposition, setSupposition] = useState(
		testData.current![dayIdx].supposition || '',
	);
	const [optimal, setOptimal] = useState(
		testData.current![dayIdx].optimal || '',
	);

	return (
		<>
			<Grid item xs={12} sm={8} md={9}>
				<Typography>{t('supposition')}</Typography>
			</Grid>
			<Grid item xs={8} sm={4} md={3}>
				<TextField
					select
					size="small"
					fullWidth
					id="supposition"
					label={t('response')}
					value={supposition}
					onChange={(e) => {
						testData.current![dayIdx].supposition = e.target.value;
						setSupposition(e.target.value);
					}}
				>
					<MenuItem value={t('idk')}>{t('idk')}</MenuItem>
					{substances.map((sub) => (
						<MenuItem key={sub.abbreviation} value={sub.name}>
							{sub.name}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item xs={12} sm={8} md={9}>
				<Typography>{t('optimal')}</Typography>
			</Grid>
			<Grid item xs={8} sm={4} md={3}>
				<TextField
					select
					size="small"
					fullWidth
					id="optimal"
					label={t('response')}
					value={optimal}
					onChange={(e) => {
						testData.current![dayIdx].optimal = e.target.value;
						setOptimal(e.target.value);
					}}
				>
					<MenuItem value={t('idk')}>{t('idk')}</MenuItem>
					<MenuItem value={t('common:yes')}>{t('common:yes')}</MenuItem>
					<MenuItem value={t('common:no')}>{t('common:no')}</MenuItem>
				</TextField>
			</Grid>
			<Grid item xs={12} sm={12}>
				<TextareaWithCustomValidation
					label={t('period-Q-remark')}
					defaultValue={testData.current![dayIdx].endPeriodRemark || ''}
					onChange={(val) => (testData.current![dayIdx].endPeriodRemark = val)}
				/>
			</Grid>
		</>
	);
}
