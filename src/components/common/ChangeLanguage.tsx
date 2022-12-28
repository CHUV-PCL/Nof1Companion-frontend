import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import setLanguage from 'next-translate/setLanguage';
import Select from '@mui/material/Select';
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import LanguageIcon from '@mui/icons-material/Language';

/**
 * Change language selector, triggering language change on the same page.
 */
export default function ChangeLanguage() {
	const router = useRouter();
	const [lang, setLang] = useState(router.locale);

	/**
	 * Handle language changes.
	 * @param lng Language selected.
	 */
	const handleClick = async (lng: string) => {
		if (router.locale !== lng) {
			await setLanguage(lng);
		}
	};

	return (
		<FormControl>
			<Select
				label="language-select"
				size="small"
				variant="standard"
				disableUnderline
				value={lang}
				onChange={(e) => setLang(e.target.value)}
				startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
				sx={{
					ml: 3,
					color: 'white',
					'& .MuiSvgIcon-root': {
						color: 'white',
					},
				}}
			>
				{router.locales?.map((lng) => (
					<MenuItem key={lng} value={lng} onClick={() => handleClick(lng)}>
						{lng}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
