import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dispatch, SetStateAction } from 'react';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/fr';

interface CustomDatePickerProps {
	value: dayjs.Dayjs | null;
	setValue: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
}

/**
 * Custom DatePicker component, with dayjs wrapping.
 */
export default function CustomDatePicker({
	value,
	setValue,
}: CustomDatePickerProps) {
	const { t, lang } = useTranslation('common');

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
			<DatePicker
				label={t('startingDate')}
				value={value}
				minDate={dayjs()}
				onChange={(newValue) => {
					setValue(newValue);
				}}
				renderInput={(params) => (
					<TextField size="small" sx={{ width: 210 }} {...params} />
				)}
			/>
		</LocalizationProvider>
	);
}
