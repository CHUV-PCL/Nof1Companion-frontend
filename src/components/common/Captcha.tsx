import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import useTranslation from 'next-translate/useTranslation';
import Typography from '@mui/material/Typography';

const charWidth = 20;

/**
 * Generates a random number between a given range (inclusive).
 * @param min Minimum range.
 * @param max Maximum range.
 * @returns A random number between the given range.
 */
const randomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Generates a captcha value.
 * @param length Captcha's length.
 * @param charMap String indicating the charset to use.
 * Nothing: upper and lower case characters + numbers | 'upper': upper case
 * characters + numbers | 'lower': lower case characters + numbers | 'numbers':
 * only numbers | 'special_char': special characters only.
 * @returns A captcha value.
 */
const generateCaptchaValue = (length: number, charMap = '') => {
	let charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
	if (charMap === 'upper') {
		charset = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
	} else if (charMap === 'lower') {
		charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
	} else if (charMap === 'numbers') {
		charset = '0123456789';
	} else if (charMap === 'special_char') {
		charset = "~`!@#$%^&*()_+-=[]{}:'<>,.?/";
	}

	let captcha = '';
	for (let i = 0, n = charset.length; i < length; ++i) {
		captcha += charset.charAt(Math.floor(Math.random() * n));
	}
	return captcha;
};

/**
 * Draws a random Bézier curve.
 * @param ctx Canvas 2D context.
 */
const drawNoiseLine = (ctx: CanvasRenderingContext2D) => {
	const randomHeight = () => Math.round(Math.random() * ctx.canvas.height);
	const randomWidth = () => Math.round(Math.random() * ctx.canvas.width);

	ctx.beginPath();
	ctx.moveTo(0, randomHeight());
	ctx.bezierCurveTo(
		ctx.canvas.width / 5 + randomWidth() / 6,
		randomHeight(),
		ctx.canvas.width / 2 + randomWidth() / 6,
		randomHeight(),
		ctx.canvas.width,
		randomHeight(),
	);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#FFCC00';
	ctx.stroke();
};

/**
 * Draws the captcha image.
 * @param canvas Html canvas element to draw on.
 * @param captcha Captcha value.
 * @param bgColor Canvas background color.
 * @param fontColor Canvas font color.
 */
const loadCaptchaEngine = (
	canvas: HTMLCanvasElement | null,
	captcha: string,
	bgColor = 'white',
	fontColor = 'black',
) => {
	const numberOfChars = captcha.length;
	const padding = 10;
	const ctx = canvas?.getContext('2d');

	if (ctx) {
		ctx.canvas.width = numberOfChars * charWidth + 2 * padding;
		ctx.canvas.height = 35;
		ctx.fillStyle = bgColor;
		ctx.clearRect(0, 0, canvas!.width, canvas!.height);
		ctx.textBaseline = 'middle';
		ctx.font = 'italic 20px Arial';
		ctx.fillStyle = fontColor;

		for (let i = 0; i < numberOfChars; i++) {
			const positionX = charWidth * i + padding;
			ctx.fillText(
				captcha[i],
				positionX,
				randomNumber(ctx.canvas.height / 3, (ctx.canvas.height * 2) / 3),
			);
		}

		drawNoiseLine(ctx);
		drawNoiseLine(ctx);
	}
};

interface Props {
	captchaNumbers: number;
	onValidation: (valid: boolean) => void;
}

/**
 * Component to draw a captcha, with verification functionality.
 */
export default function Captcha({ captchaNumbers, onValidation }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [captchaValue, setCaptchaValue] = useState(
		generateCaptchaValue(captchaNumbers),
	);
	const [isValid, setIsValid] = useState(false);
	const [captchaHelperTxt, setCaptchaHelperTxt] = useState('');
	const { t } = useTranslation('auth');

	// draws the captcha canvas when the captcha value change.
	useEffect(() => {
		loadCaptchaEngine(canvasRef.current, captchaValue);
	}, [captchaNumbers, captchaValue]);

	/**
	 * Generates a new captcha element.
	 */
	const reloadCaptcha = () => {
		setCaptchaHelperTxt('');
		setCaptchaValue(generateCaptchaValue(captchaNumbers));
	};

	/**
	 * Verifies the user input. If it does not match the captcha, clears the input
	 * and generates a new captcha. Otherwise, replaces the captcha element with
	 * a success Alert.
	 */
	const validateCaptcha = () => {
		const input = inputRef.current?.value;
		let valid = true;
		if (input != captchaValue) {
			valid = false;
			inputRef.current!.value = ''; // clear input
			reloadCaptcha();
			setCaptchaHelperTxt(t('captcha-helper-txt'));
		} else {
			setIsValid((prevState) => !prevState);
		}
		onValidation(valid);
	};

	return (
		<>
			{isValid ? (
				<Alert>{t('captcha-success')}</Alert>
			) : (
				<Stack alignItems="center" spacing={1}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<canvas id="canv" ref={canvasRef} />
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
							sx={{ width: captchaNumbers * charWidth }}
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
