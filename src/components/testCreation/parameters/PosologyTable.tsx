import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { Posology, PosologyDay } from '../../../entities/posology';
import {
	numericInputPattern,
	numericInputRegex,
} from '../../../utils/constants';
import { StyledTableCell } from '../../common/table/customTableComponents';
import EditablePosologyTable, {
	RegisterType,
} from '../../common/table/posologyTable/EditablePosologyTable';

interface PosologyTableProps {
	rows: PosologyDay[];
	repeatLast: boolean;
	onSave: (posology: Posology) => void;
	substanceUnit: string;
}

/**
 * Table component for a posology.
 */
export default function PosologyTable({
	rows,
	repeatLast,
	onSave,
	substanceUnit,
}: PosologyTableProps) {
	const [checked, setChecked] = useState(repeatLast);
	const { t } = useTranslation('createTest');

	const { register, handleSubmit } = useForm<PosologyDay[]>({
		defaultValues: rows,
	});

	/**
	 * Handles form submit.
	 * @param data Form data.
	 */
	const onSubmit = (data: PosologyDay[]) => {
		onSave({ posology: data, repeatLast: checked });
	};

	/**
	 * Renders an input TableCell component.
	 * @param name Name of the input.
	 * @param defaultValue Default value.
	 * @param borderRight Display a right border.
	 * @returns The TableCell component.
	 */
	const renderTableCell = (
		name: RegisterType,
		defaultValue: number,
		borderRight: boolean = false,
	) => {
		return (
			<StyledTableCell align="center" borderR={borderRight}>
				<Input
					size="small"
					autoFocus
					id={name}
					disableUnderline
					inputProps={{
						min: 0,
						style: { textAlign: 'center' },
						inputMode: 'numeric',
						pattern: numericInputPattern,
						title: t('common:formErrors.number'),
					}}
					defaultValue={defaultValue}
					{...register(name, {
						valueAsNumber: true,
						pattern: {
							value: numericInputRegex,
							message: t('common:formErrors.number'),
						},
					})}
				/>
			</StyledTableCell>
		);
	};

	return (
		<>
			<Box component="form" id="" onSubmit={handleSubmit(onSubmit)}>
				<EditablePosologyTable
					rows={rows}
					substanceUnit={substanceUnit}
					renderTableCell={renderTableCell}
				/>
				<Stack direction="row" alignItems="center" spacing={2} mt={1}>
					<Checkbox
						checked={checked}
						onChange={(e) => setChecked(e.target.checked)}
					/>
					<Typography>{t('parameters.posology-repeat-switch')}</Typography>
				</Stack>
				<Stack direction="row" alignItems="center" spacing={2} mt={1} px={2}>
					<Button type="submit" variant="contained" size="small">
						{t('parameters.save-posology-btn')}
					</Button>
					<Typography variant="body2" fontWeight="bold">
						{t('parameters.warning-save-posology')}
					</Typography>
				</Stack>
			</Box>
		</>
	);
}
