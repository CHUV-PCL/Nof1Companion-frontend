import { ChangeEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import VarLayout from './VarLayout';
import { VarProps } from './varCommon';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { numericInputRegex, numericInputPattern } from '../../utils/constants';
import { VariableType } from '../../entities/variable';
import { NumberTextField } from '../common/ui';

/**
 * Component that renders an input for a numeric type variable.
 */
export default function Numeric({
	variable,
	defaultValue,
	onChange,
}: VarProps) {
	const { t } = useTranslation('importData');
	const [value, setValue] = useState(defaultValue);

	/**
	 * Handles input value changes.
	 * @param e HTML event.
	 */
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setValue(e.target.value);
		onChange(e.target.value);
	};

	/**
	 * Checks if the input is invalid.
	 */
	const isInvalid = () => {
		if (value === '') {
			return false;
		}
		let valid = numericInputRegex.test(value);
		// check bounds
		const min = Number(variable.min);
		const max = Number(variable.max);
		if (valid && (min || min === 0)) {
			valid = Number(value) >= min;
		}
		if (valid && (max || max === 0)) {
			valid = Number(value) <= max;
		}
		return !valid;
	};

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<Stack direction="row" alignItems="baseline" spacing={3}>
				<NumberTextField
					id="numeric-input"
					label={t('response')}
					type="number"
					inputProps={{
						inputMode: 'numeric',
						pattern: numericInputPattern,
						title: t('common:formErrors.number'),
						min: variable.min,
						max: variable.max,
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">{variable.unit}</InputAdornment>
						),
					}}
					value={value}
					onChange={handleChange}
					error={isInvalid()}
					helperText={isInvalid() ? t('common:formErrors.number') : ''}
				/>
				{variable.type === VariableType.Numeric && (
					<Typography color={isInvalid() ? 'error' : 'black'}>
						{t('value-btw', { x: variable.min, y: variable.max })}
					</Typography>
				)}
			</Stack>
		</VarLayout>
	);
}
