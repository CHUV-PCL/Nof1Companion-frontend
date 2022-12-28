import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterSchema, RegisterForm } from '../../utils/zodValidationHook';
import { formatRegisterData } from '../../utils/dataFormConvertor';
import { authenticate } from '../../utils/nof1-lib/api-calls/apiAuth';
import { UserContextType } from '../../context/UserContext';
import CaptchaSS from '../common/CaptchaSS';
import { TypographyWLineBreak } from '../common/ui';

type SignUpProps = {
	login: (u: UserContextType) => void;
};

/**
 * Sign Up component. Expose a form to register a new user.
 */
export default function SignUp({ login }: SignUpProps) {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [userExists, setUserExists] = useState(false);
	const registerSchema = useRegisterSchema();
	const [isCaptchaValid, setIsCaptchaValid] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	/**
	 * Helper method called by the API call that handles the response.
	 * @param noError Boolean value indicating errors during authentication.
	 * @param user User resulting from the authentication.
	 */
	const handleAuth = (noError: boolean, user: UserContextType) => {
		if (noError) {
			login(user);
			router.push('/nof1');
		} else {
			setUserExists(true);
		}
	};

	/**
	 * Handles submit of the form. It calls the API to register the user.
	 * @param data Data from the form.
	 */
	const onSubmitHandler: SubmitHandler<RegisterForm> = async (data) => {
		if (isCaptchaValid) {
			authenticate('/auth/register', formatRegisterData(data), handleAuth);
		}
	};

	/**
	 * Displays an error message for the field, if any.
	 * @param field Errors field.
	 * @returns The error string message.
	 */
	const helperText = (field: keyof typeof errors) => errors[field]?.message;

	return (
		<Card>
			<CardContent>
				<Typography component="h1" variant="h5" align="center">
					{t('form.signUp')}
				</Typography>
				<Box
					component="form"
					id="signup-form"
					noValidate
					onSubmit={handleSubmit(onSubmitHandler)}
					mt={2}
				>
					<Grid
						container
						spacing={1}
						alignItems="center"
						justifyContent="center"
					>
						<Grid item xs={12} sm={12}>
							<TextField
								required
								fullWidth
								id="institution"
								label={t('form.institution')}
								error={!!errors['institution']}
								helperText={helperText('institution')}
								{...register('institution')}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="firstname"
								label={t('form.firstname')}
								error={!!errors['firstname']}
								helperText={helperText('firstname')}
								{...register('firstname')}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="lastname"
								label={t('form.lastname')}
								error={!!errors['lastname']}
								helperText={helperText('lastname')}
								{...register('lastname')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="phone"
								type="tel"
								label={t('form.phone')}
								error={!!errors['phone']}
								helperText={helperText('phone')}
								{...register('phone')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id="street"
								label={t('form.street')}
								error={!!errors['street']}
								helperText={helperText('street')}
								{...register('street')}
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								fullWidth
								id="zip"
								label={t('form.zip')}
								error={!!errors['zip']}
								helperText={helperText('zip')}
								{...register('zip')}
							/>
						</Grid>
						<Grid item xs={12} sm={7}>
							<TextField
								fullWidth
								id="city"
								label={t('form.city')}
								error={!!errors['city']}
								helperText={helperText('city')}
								{...register('city')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								id="country"
								label={t('form.country')}
								error={!!errors['country']}
								helperText={helperText('country')}
								{...register('country')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								type="email"
								label={t('form.email')}
								autoComplete="email"
								error={!!errors['email']}
								helperText={helperText('email')}
								{...register('email')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="password"
								type="password"
								label={t('form.password')}
								error={!!errors['password']}
								helperText={helperText('password')}
								{...register('password')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="passwordConfirm"
								type="password"
								label={t('form.passwordConfirm')}
								error={!!errors['passwordConfirm']}
								helperText={helperText('passwordConfirm')}
								{...register('passwordConfirm')}
							/>
						</Grid>
						<Grid item xs={12}>
							<Alert variant="outlined" severity="warning">
								<TypographyWLineBreak variant="body2">
									{t('auth:pwd-instructions')}
								</TypographyWLineBreak>
							</Alert>
						</Grid>
						<Grid item xs={12}>
							<CaptchaSS
								onValidation={(valid: boolean) => setIsCaptchaValid(valid)}
							/>
						</Grid>
						{userExists && (
							<Grid item xs={12}>
								<Alert severity="error">
									{t('formErrors.userAlreadyExists')}
								</Alert>
							</Grid>
						)}
						<Grid item xs={5} sm={6}>
							<Button
								type="submit"
								form="signup-form"
								variant="contained"
								fullWidth
								disabled={!isCaptchaValid}
								sx={{ mt: 2 }}
							>
								{t('form.signUp')}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
}
