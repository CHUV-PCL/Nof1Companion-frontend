import VarLayout from './VarLayout';
import { VarProps } from './varCommon';
import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const min = 0;
const max = 100;

/**
 * Component that renders a slider for a VAS type variable.
 */
export default function Numeric({
	variable,
	defaultValue,
	onChange,
}: VarProps) {
	const [value, setValue] = useState(defaultValue);

	/**
	 * Handles slider value changes.
	 * @param event The event source of the callback.
	 * @param value Slider new value.
	 * @param activeThumb Index of the currently moved thumb.
	 */
	const handleChange = (
		event: Event,
		value: number | number[],
		activeThumb: number,
	) => {
		setValue(String(value));
		onChange(String(value));
	};

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<Box width={'100%'}>
				<Slider
					aria-label="vas"
					step={1}
					min={min}
					max={max}
					value={Number(value)}
					onChange={handleChange}
				/>
				<Stack direction="row" justifyContent="space-between" width="100%">
					<Typography>{variable.min}</Typography>
					<Typography>{variable.max}</Typography>
				</Stack>
			</Box>
		</VarLayout>
	);
}
