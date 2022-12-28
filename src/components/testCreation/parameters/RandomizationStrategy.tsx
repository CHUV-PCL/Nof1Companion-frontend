import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { RandomStrategyProps } from '.';
import { TypographyWLineBreak } from '../../common/ui';
import { maxRepOptions } from '../../../utils/constants';
import {
	RandomStrategy,
	RandomizationStrategy as IRandomizationStrategy,
} from '../../../utils/nof1-lib/randomizationStrategy';

/**
 * Randomization strategy component. Renders the radio group for all strategies.
 */
export default function RandomizationStrategy({
	strategy,
	setStrategy,
	isSequenceError,
}: RandomStrategyProps) {
	const { t } = useTranslation('createTest');
	const [sequence, setSequence] = useState<string | undefined>(
		strategy.predefinedSeq?.join(';'),
	);
	const sequenceError =
		sequence !== undefined && isSequenceError(sequence.split(';'));

	/**
	 * Renders the appropriate strategy label component.
	 * @param randomStrategy Strategy.
	 * @returns The appropriate strategy label component.
	 */
	const strategyLabels = (randomStrategy: RandomStrategy) => {
		switch (randomStrategy) {
			case RandomStrategy.Permutations:
				return (
					<Stack direction="row" alignItems="center" spacing={1} pt={'9px'}>
						<Typography>{t('parameters.RS-permutation')}</Typography>
						<Tooltip
							title={
								<TypographyWLineBreak>
									{t('parameters.RS-permutation-helper')}
								</TypographyWLineBreak>
							}
							placement="right"
							arrow
						>
							<InfoOutlinedIcon color="primary" />
						</Tooltip>
					</Stack>
				);
			case RandomStrategy.MaxRep:
				return (
					<>
						<Typography variant="body1" pt={'9px'}>
							{t('parameters.RS-random-max-rep')}
						</Typography>
						<Stack direction="row" alignItems="center" spacing={2}>
							<Typography component="span" variant="body1">
								{t('parameters.RS-random-max-rep-N')}
							</Typography>
							<Select
								id="maxRep-select"
								size="small"
								disabled={strategy.strategy != RandomStrategy.MaxRep}
								value={strategy.maxRep || 1}
								onChange={(e) =>
									setStrategy((prevState) => ({
										...prevState,
										maxRep: Number(e.target.value),
									}))
								}
							>
								{maxRepOptions.map((rep) => {
									return (
										<MenuItem key={rep} value={rep}>
											{rep}
										</MenuItem>
									);
								})}
							</Select>
						</Stack>
					</>
				);
			case RandomStrategy.Custom:
				return (
					<>
						<TypographyWLineBreak pt={'9px'}>
							{t('parameters.RS-custom')} {t('parameters.RS-custom-warning')}
						</TypographyWLineBreak>
						<TextField
							size="small"
							disabled={strategy.strategy != RandomStrategy.Custom}
							name="predefinedSeq"
							type="text"
							value={sequence || ''}
							onChange={(e) => {
								const seq = e.target.value;
								setSequence(seq);
								setStrategy((prevState) => ({
									...prevState,
									predefinedSeq: seq.split(';'),
								}));
							}}
							error={sequenceError}
							helperText={sequenceError && t('common:formErrors.errorField')}
						/>
					</>
				);
		}
	};

	/**
	 * Handles changes of strategy choices.
	 * @param e HTML event.
	 */
	const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
		const strategy = e.target.value as RandomStrategy;
		const rStrategy: IRandomizationStrategy = { strategy };
		switch (strategy) {
			case RandomStrategy.MaxRep:
				rStrategy.maxRep = 1;
				break;
			case RandomStrategy.Custom:
				rStrategy.predefinedSeq = sequence?.split(';');
				break;
		}
		setStrategy(rStrategy);
	};

	return (
		<>
			<Typography variant="h6" fontWeight="bold" mb={2}>
				{t('parameters.subtitle-randomStrategy')}
			</Typography>
			<Typography>{t('parameters.randomStrategy-desc')}</Typography>
			<FormControl>
				<RadioGroup
					name="strategy-group"
					value={strategy.strategy}
					onChange={handleRadioChange}
				>
					{Object.values(RandomStrategy).map((strategy) => {
						return (
							<FormControlLabel
								key={strategy}
								value={strategy}
								control={<Radio />}
								label={strategyLabels(strategy)}
								sx={{ alignItems: 'flex-start' }}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
		</>
	);
}
