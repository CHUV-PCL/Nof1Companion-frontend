import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Grid from '@mui/material/Grid';
import { useUserContext } from '../context/UserContext';
import Page from '../components/layout/Page';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import { TypographyWLineBreak } from '../components/common/ui';

/**
 * Default application page. It requires the user to login or
 * to create an account to proceed further.
 */
export default function Auth() {
	const { t } = useTranslation('common');
	const { login } = useUserContext();
	const router = useRouter();

	// optimize loading of the next page.
	useEffect(() => {
		router.prefetch('/nof1');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Page>
			<Grid
				container
				rowSpacing={5}
				columnGap={12}
				alignItems="center"
				justifyContent="center"
			>
				<Grid item xs={12}>
					<TypographyWLineBreak variant="h5" align="center">
						{t('auth:welcome')}
					</TypographyWLineBreak>
				</Grid>
				<Grid item xs={12} sm={9} md={5}>
					<SignIn login={login} />
				</Grid>
				<Grid item xs={12} sm={9} md={5}>
					<SignUp login={login} />
				</Grid>
			</Grid>
		</Page>
	);
}
