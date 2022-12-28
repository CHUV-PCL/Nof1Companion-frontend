import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';
import {
	getCaptcha,
	verifyCaptcha,
} from '../../utils/nof1-lib/api-calls/apiAuth';
import Box from '@mui/material/Box';

interface CaptchaSSProps {
	onValidation: (valid: boolean) => void;
}

/**
 * Component to draw a captcha, with verification functionality.
 */
export default function CaptchaSS({ onValidation }: CaptchaSSProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isValid, setIsValid] = useState(false);
	const [captchaHelperTxt, setCaptchaHelperTxt] = useState('');
	const { t } = useTranslation('auth');
	const [captchaImg, setCaptchaImg] = useState('');

	/**
	 * Fetches the captcha svg.
	 */
	const fetchCaptcha = async () => {
		const captchaImg = await getCaptcha();
		setCaptchaImg(captchaImg);
	};

	// Fetches the initial captcha.
	useEffect(() => {
		if (captchaImg === '') {
			fetchCaptcha();
		}
	}, [captchaImg]);

	/**
	 * Generates a new captcha element.
	 */
	const reloadCaptcha = () => {
		setCaptchaHelperTxt('');
		fetchCaptcha();
	};

	/**
	 * Verifies the user input. If it does not match the captcha, clears the input
	 * and generates a new captcha. Otherwise, replaces the captcha element with
	 * a success Alert.
	 */
	const validateCaptcha = async () => {
		const input = inputRef.current?.value;
		if (input) {
			const verified = await verifyCaptcha(input);
			if (verified) {
				setIsValid((prevState) => !prevState);
			} else {
				inputRef.current.value = ''; // clear input
				reloadCaptcha();
				setCaptchaHelperTxt(t('captcha-helper-txt'));
			}
			onValidation(verified);
		} else {
			setCaptchaHelperTxt(t('common:formErrors.requiredField'));
		}
	};

	return (
		<>
			{isValid ? (
				<Alert>{t('captcha-success')}</Alert>
			) : (
				<Stack alignItems="center">
					<Stack direction="row" alignItems="center" spacing={1}>
						<Box height={50} dangerouslySetInnerHTML={{ __html: captchaImg }} />
						<IconButton
							aria-label="reload-captcha"
							size="small"
							color="primary"
							onClick={() => reloadCaptcha()}
						>
							<ReplayIcon fontSize="small" />
						</IconButton>
						<TextField
							size="small"
							inputRef={inputRef}
							error={captchaHelperTxt !== ''}
							sx={{ width: 120 }}
						/>
						<Button size="small" onClick={() => validateCaptcha()}>
							{t('captcha-btn')}
						</Button>
					</Stack>
					<Typography color="error" variant="caption">
						{captchaHelperTxt}
					</Typography>
				</Stack>
			)}
		</>
	);
}
