import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { ChangeEvent, useState } from 'react';
import VarLayout from './VarLayout';
import { VarProps } from './varCommon';

/**
 * Component that renders an input for a binary type variable.
 */
export default function Binary({ variable, defaultValue, onChange }: VarProps) {
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

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<FormControl>
				<RadioGroup
					row
					name="binary-choice"
					value={value}
					onChange={handleChange}
				>
					<FormControlLabel
						value={variable.min}
						control={<Radio />}
						label={variable.min}
						labelPlacement="bottom"
					/>
					<FormControlLabel
						value={variable.max}
						control={<Radio />}
						label={variable.max}
						labelPlacement="bottom"
					/>
				</RadioGroup>
			</FormControl>
		</VarLayout>
	);
}
