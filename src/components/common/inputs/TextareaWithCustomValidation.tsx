import TextField from '@mui/material/TextField';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { textareaRegex } from '../../../utils/constants';
import useTranslation from 'next-translate/useTranslation';

interface TextareaWithCustomValidationProps {
	label: string;
	defaultValue: string;
	onChange: (value: string) => void;
	minRows?: number;
	maxRows?: number;
	maxLength?: number;
}

export default function TextareaWithCustomValidation({
	label,
	defaultValue,
	onChange,
	minRows = 2,
	maxRows = 5,
	maxLength = 500,
}: TextareaWithCustomValidationProps) {
	const { t } = useTranslation('common');
	const [value, setValue] = useState(defaultValue);
	const textAreaRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
	 * Checks if the input is valid.
	 */
	const isValid = value === '' || textareaRegex.test(value);

	/**
	 * Set a custom validation on the textarea element,
	 * which will be detected by the form.
	 */
	useEffect(() => {
		textAreaRef.current?.setCustomValidity(
			isValid ? '' : t('formErrors.textarea'),
		);
		textAreaRef.current?.reportValidity();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<TextField
			id="multiline-input"
			inputRef={textAreaRef}
			label={label}
			fullWidth
			multiline
      size="small"
			minRows={minRows}
			maxRows={maxRows}
			inputProps={{ maxLength }}
			value={value}
			onChange={handleChange}
			error={!isValid}
			helperText={isValid ? '' : t('formErrors.textarea')}
		/>
	);
}
