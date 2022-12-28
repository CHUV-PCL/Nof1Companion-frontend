import { Dispatch, SetStateAction } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Substances from './Substances';
import Posologies from './Posologies';
import RandomizationStrategy from './RandomizationStrategy';
import SelectAnalysisType from '../../common/inputs/SelectAnalysisType';
import { SectionCard, TypographyWLineBreak } from '../../common/ui';
import { Substance } from '../../../entities/substance';
import { SubstancePosologies } from '../../../entities/posology';
import { maxValue } from '../../../utils/constants';
import { RandomizationStrategy as IRandomizationStrategy } from '../../../utils/nof1-lib/randomizationStrategy';
import { AnalyseType } from '../../../utils/statistics';

export interface SubstancesProps {
	substances: Substance[];
	setSubstances: Dispatch<SetStateAction<Substance[]>>;
	editable: boolean;
}

export interface RandomStrategyProps {
	strategy: IRandomizationStrategy;
	setStrategy: Dispatch<SetStateAction<IRandomizationStrategy>>;
	isSequenceError: (seq: string[]) => boolean;
}

export interface PosologiesProps {
	substances: Substance[];
	setSubstances: Dispatch<SetStateAction<Substance[]>>;
	periodLen: number;
	allPosologies: SubstancePosologies[];
	setAllPosologies: Dispatch<SetStateAction<SubstancePosologies[]>>;
}

interface TestParametersProps
	extends Omit<SubstancesProps, 'editable'>,
		Omit<RandomStrategyProps, 'isSequenceError'>,
		Omit<PosologiesProps, 'substances' | 'setSubstances'> {
	nbPeriods: number;
	setNbPeriods: Dispatch<SetStateAction<number>>;
	setPeriodLen: Dispatch<SetStateAction<number>>;
	analysisToPerform: AnalyseType;
	setAnalysisToPerform: Dispatch<SetStateAction<AnalyseType>>;
}

/**
 * Test parameters section component. Render inputs for the parameters of the test.
 */
export default function TestParameters({
	substances,
	setSubstances,
	strategy,
	setStrategy,
	nbPeriods,
	setNbPeriods,
	periodLen,
	setPeriodLen,
	allPosologies,
	setAllPosologies,
	analysisToPerform,
	setAnalysisToPerform,
}: TestParametersProps) {
	const { t } = useTranslation('createTest');
	const nbPeriodsError = nbPeriods > maxValue;
	const periodLenError = periodLen > maxValue;

	return (
		<SectionCard>
			<Grid container rowSpacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5" fontWeight="bold">
						{t('parameters.title')}
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="h6" fontWeight="bold">
						{t('parameters.subtitle-duration')}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={3} my={1}>
						<Typography variant="body1">
							{t('parameters.periods-nb')}
						</Typography>
						<TextField
							size="small"
							sx={{ width: 110 }}
							type="number"
							InputProps={{ inputProps: { min: 1 } }}
							name="nbPeriods"
							value={nbPeriods}
							onChange={(e) => setNbPeriods(Number(e.target.value))}
							error={nbPeriodsError}
							helperText={
								nbPeriodsError && t('parameters.max-value', { max: maxValue })
							}
						/>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={3} my={1}>
						<Typography variant="body1">
							{t('parameters.period-duration')}
						</Typography>
						<TextField
							disabled={allPosologies.length !== 0}
							size="small"
							sx={{ width: 110 }}
							type="number"
							InputProps={{ inputProps: { min: 1 } }}
							name="periodLen"
							value={periodLen}
							onChange={(e) => setPeriodLen(Number(e.target.value))}
							error={periodLenError}
							helperText={
								periodLenError && t('parameters.max-value', { max: maxValue })
							}
						/>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={3} my={1}>
						<Typography variant="body1">
							{t('parameters.analysisToPerform')} :
						</Typography>
						<SelectAnalysisType
							value={analysisToPerform}
							onChange={(e) =>
								setAnalysisToPerform(e.target.value as AnalyseType)
							}
						/>
					</Stack>
					<Box paddingX={3}>
						<Typography>{t('common:statistics.type')}</Typography>
						<Typography>
							<b>{t('common:statistics.NaiveANOVA-long')}</b> :{' '}
							{t('common:statistics.NaiveANOVA-desc')}
						</Typography>
						<Typography>
							<b>{t('common:statistics.CycleANOVA-long')}</b> :{' '}
							{t('common:statistics.CycleANOVA-desc')}
						</Typography>
						<Typography>
							<b>{t('common:statistics.ANCOVAautoregr-long')}</b> :{' '}
							{t('common:statistics.ANCOVAautoregr-desc')}
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={12}>
					<Substances
						substances={substances}
						setSubstances={setSubstances}
						editable={allPosologies.length === 0}
					/>
				</Grid>

				<Grid item xs={12}>
					<RandomizationStrategy
						strategy={strategy}
						setStrategy={setStrategy}
						isSequenceError={(seq) =>
							seq.length !== nbPeriods ||
							!seq.every((s) =>
								substances.map((sub) => sub.abbreviation).includes(s),
							)
						}
					/>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="h6" fontWeight="bold" mb={2}>
						{t('parameters.subtitle-posology')}
					</Typography>
					<TypographyWLineBreak>
						{t('parameters.posology-desc')}
					</TypographyWLineBreak>
					<Typography>{t('parameters.posology-supp-desc')}</Typography>
				</Grid>

				<Grid item xs={12}>
					<Posologies
						substances={substances}
						setSubstances={setSubstances}
						periodLen={periodLen}
						allPosologies={allPosologies}
						setAllPosologies={setAllPosologies}
					/>
				</Grid>
			</Grid>
		</SectionCard>
	);
}
