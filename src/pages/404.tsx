import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useUserContext } from '../context/UserContext';
import Page from '../components/layout/Page';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Custom404() {
	const { userContext } = useUserContext();
	const { t } = useTranslation('common');

	return (
		<Page>
			<Stack
				justifyContent="center"
				alignItems="center"
				spacing={6}
				height="60vh"
			>
				<Typography variant="h2">404 - {t('404')}</Typography>
				<Button variant="contained">
					{userContext?.user ? (
						<Link href="/nof1">
							<Typography variant="button">
								{t('common:button.backToNof1')}
							</Typography>
						</Link>
					) : (
						<Link href="/">
							<Typography variant="button">
								{t('common:button.backToLogin')}
							</Typography>
						</Link>
					)}
				</Button>
			</Stack>
		</Page>
	);
}
