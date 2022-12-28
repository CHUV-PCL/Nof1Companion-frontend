import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { SubstancesProps } from '.';
import { emptySubstance, Substance } from '../../../entities/substance';
import { maxNbSubstances } from '../../../utils/constants';

/**
 * Substances component. Renders the substances inputs.
 */
export default function Substances({
	substances,
	setSubstances,
	editable,
}: SubstancesProps) {
	const { t } = useTranslation('createTest');

	/**
	 * Add a new substance input.
	 */
	const addSubstance = () => {
		setSubstances((prevSubstances) => [
			...prevSubstances,
			{ ...emptySubstance },
		]);
	};

	/**
	 * Remove a substance.
	 * @param idx Index of the substance.
	 */
	const removeSubstance = (idx: number) => {
		setSubstances((prevSubstances) => {
			const array = [...prevSubstances];
			array.splice(idx, 1);
			return array;
		});
	};

	/**
	 * Handle input modifications.
	 * @param idx Index of the substance.
	 * @param e HTML event.
	 */
	const handleChange = (
		idx: number,
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		const array = [...substances];
		array[idx][name as keyof Substance] = value;
		setSubstances(array);
	};

	return (
		<Stack spacing={2} alignItems="flex-start" mb={1}>
			<Typography variant="h6" fontWeight="bold">
				{t('parameters.subtitle-substances')}
			</Typography>
			<Typography fontStyle="italic">
				{t('parameters.same-substance-warning')}
			</Typography>
			{substances.map((sub, idx) => (
				<Stack
					direction="row"
					alignItems="center"
					spacing={2}
					key={`substance-row-${idx}`}
				>
					<TextField
						disabled={!editable}
						size="small"
						type="text"
						label={t('parameters.substance-name')}
						name="name"
						value={sub.name}
						onChange={(e) => handleChange(idx, e)}
					/>
					<TextField
						size="small"
						type="text"
						label={t('parameters.substance-abbrev')}
						name="abbreviation"
						value={sub.abbreviation}
						onChange={(e) => handleChange(idx, e)}
					/>
					<TextField
						size="small"
						type="text"
						label={t('common:measure-unit-label')}
						name="unit"
						value={sub.unit}
						onChange={(e) => handleChange(idx, e)}
					/>
					{substances.length && (
						<IconButton
							color="error"
							aria-label="delete"
							onClick={() => removeSubstance(idx)}
							disabled={!editable}
						>
							<DeleteForeverIcon />
						</IconButton>
					)}
				</Stack>
			))}
			<Button
				variant="contained"
				startIcon={<AddIcon />}
				onClick={addSubstance}
				disabled={!editable || substances.length === maxNbSubstances}
			>
				{t('common:button.add')}
			</Button>
		</Stack>
	);
}
