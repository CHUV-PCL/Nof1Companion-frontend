import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Page from '../components/layout/Page';
import { TypographyWLineBreak } from '../components/common/ui';
import ResetPwdDialog from '../components/auth/ResetPwdDialog';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { passwordRegex } from '../utils/constants';
import { checkTokenValidity } from '../utils/nof1-lib/api-calls/apiAuth';
import { changePassword } from '../utils/nof1-lib/api-calls/apiUsers';

/**
 * Page managing the user's password reset feature.
 */
export default function ResetPassword() {
	const { t } = useTranslation('auth');
	const router = useRouter();
	const [apiToken, setApiToken] = useState('');
	const [userId, setUserId] = useState('');
	const [pwd, setPwd] = useState('');
	const [confirmPwd, setConfirmPwd] = useState('');
	const [resetSuccessful, setResetSuccessful] = useState(false);
	const [failure, setFailure] = useState(false);
	const [tokenExpired, setTokenExpired] = useState(false);
	const [loading, setLoading] = useState(true);
	const [openResetPwdDialog, setOpenResetPwdDialog] = useState(false);

	// checks token validity and init states
	useEffect(() => {
		async function checkToken(id: string, token: string) {
			const success = await checkTokenValidity(token);
			if (!success) {
				setTokenExpired(true);
			}
			setApiToken(token);
			setUserId(id);
			setLoading(false);
		}
		if (router.isReady) {
			const { token, id } = router.query;
			checkToken(id as string, token as string);
		}
	}, [router]);

	const validPwd = pwd.match(passwordRegex);
	const pwdMatch = pwd === confirmPwd;

	/**
	 * Handles the reset action. Checks validity and send the request.
	 */
	const handleClick = async () => {
		if (validPwd && pwdMatch) {
			const { success } = await changePassword(apiToken, {
				id: userId,
				newPwd: pwd,
			});
			success ? setResetSuccessful(true) : setFailure(true);
		}
	};

	// button to navigate to the login page.
	const backToLogin = (
		<Button variant="outlined" onClick={() => router.replace('/')}>
			{t('common:button.backToLogin')}
		</Button>
	);

	if (loading) {
		return (
			<Page>
				<Box maxWidth={{ xs: '95%', sm: '70%', md: '60%' }} mx="auto">
					<Skeleton variant="rectangular" animation="wave" height={'50vh'} />
				</Box>
			</Page>
		);
	}

	return (
		<Page>
			<Box maxWidth={{ xs: '95%', sm: '70%', md: '60%' }} mx="auto">
				<Card>
					{tokenExpired ? (
						// Card explaining the expiration link, with buttons to
						// resend a link or to go to the login page.
						<>
							<CardContent>
								<Stack alignItems="center" spacing={4} mt={1}>
									<Alert variant="outlined" severity="warning">
										<Typography fontWeight="bold">
											{t('reset-pwd.link-expired')}
										</Typography>
									</Alert>
									<Typography gutterBottom textAlign="center">
										{t('reset-pwd.link-expired-desc')}
									</Typography>
									<Stack direction="row" alignItems="stretch" spacing={3}>
										<Button
											variant="contained"
											onClick={() => setOpenResetPwdDialog(true)}
										>
											{t('forgot-pwd.dialog-btn')}
										</Button>
										{backToLogin}
									</Stack>
								</Stack>
							</CardContent>
							<ResetPwdDialog
								open={openResetPwdDialog}
								handleClose={() => setOpenResetPwdDialog(false)}
							/>
						</>
					) : (
						// Card with a reset password form.
						<CardContent>
							<Stack spacing={2} paddingX={2} alignItems="center" mt={1}>
								<Typography variant="h5" gutterBottom>
									{t('reset-pwd.title')}
								</Typography>
								<TextField
									required
									fullWidth
									id="new-password"
									name="new-password"
									type="password"
									label={t('common:form.password')}
									value={pwd}
									onChange={(e) => setPwd(e.target.value)}
									error={!validPwd}
									helperText={
										!validPwd && t('common:formErrors.invalidPassword')
									}
								/>
								<TextField
									required
									fullWidth
									id="passwordConfirm"
									name="passwordConfirm"
									type="password"
									label={t('common:form.passwordConfirm')}
									value={confirmPwd}
									onChange={(e) => setConfirmPwd(e.target.value)}
									error={!pwdMatch}
									helperText={
										!pwdMatch && t('common:formErrors.passwordConfirmNoMatch')
									}
								/>
								<Alert variant="outlined" severity="warning">
									<TypographyWLineBreak variant="body2">
										{t('pwd-instructions')}
									</TypographyWLineBreak>
								</Alert>
								<Button variant="contained" onClick={handleClick}>
									{t('reset-pwd.link')}
								</Button>
								{resetSuccessful && (
									<>
										<Alert severity="success">{t('alert.reset-success')}</Alert>
										{backToLogin}
									</>
								)}
								{failure && (
									<Alert severity="error">
										{t('common:formErrors.unexpectedErrorMsg')}
									</Alert>
								)}
							</Stack>
						</CardContent>
					)}
				</Card>
			</Box>
		</Page>
	);
}
