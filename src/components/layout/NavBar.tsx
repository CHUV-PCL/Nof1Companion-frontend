import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { AnchorHTMLAttributes, forwardRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useUserContext } from '../../context/UserContext';
import ChangeLanguage from '../common/ChangeLanguage';
import { LinkTxt } from '../common/ui';

/**
 * Common navigation bar component.
 */
export default function NavBar() {
	const { t } = useTranslation('common');
	const { userContext, logout } = useUserContext();

	/**
	 * Custom logout link.
	 */
	const LogoutBtn = forwardRef<
		HTMLAnchorElement,
		AnchorHTMLAttributes<HTMLAnchorElement>
	>(({ href, onClick }, ref) => {
		return (
			<a
				href={href}
				onClick={onClick}
				ref={ref}
				style={{ textDecoration: 'none', color: 'inherit' }}
			>
				<LinkTxt>{t('nav.logout')}</LinkTxt>
			</a>
		);
	});
	LogoutBtn.displayName = 'LogoutBtn';

	return (
		<AppBar position="static">
			<Container component="div" maxWidth="xl">
				<Toolbar component="nav">
					<Link href={userContext?.user ? '/nof1' : '/'}>
						<Box flexGrow={1}>
							<LinkTxt
								variant="h5"
								fontWeight="bold"
								fontStyle="italic"
								display="inline-block"
							>
								{t('nav.title')}
							</LinkTxt>
						</Box>
					</Link>
					{userContext?.user && (
						<Stack direction="row" spacing={3}>
							<Link href="/nof1">
								<LinkTxt>{t('nav.nof1List')}</LinkTxt>
							</Link>
							<Link href="/profile">
								<LinkTxt>{t('nav.profile')}</LinkTxt>
							</Link>
							<Link href="/" passHref>
								<LogoutBtn onClick={logout} />
							</Link>
						</Stack>
					)}
					<ChangeLanguage />
				</Toolbar>
			</Container>
		</AppBar>
	);
}
