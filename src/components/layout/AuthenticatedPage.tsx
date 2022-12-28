import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { getUser } from '../../utils/nof1-lib/api-calls/apiPhysicians';
import { USER_CTX_KEY } from '../../utils/constants';
import Page from './Page';

type PageProps = {
	children: ReactNode;
};

/**
 * Page requiring authentication.
 */
export default function AuthenticatedPage({ children }: PageProps) {
	const { userContext, setUserContext, logout } = useUserContext();
	const router = useRouter();

	// Checks if the user is authenticated, otherwise redirects to the login page.
	// On refresh, checks the browser session storage to find a user session information.
	useEffect(() => {
		async function checkAuth() {
			if (userContext.user === null) {
				const loggedInUser = sessionStorage.getItem(USER_CTX_KEY);
				if (loggedInUser) {
					const foundUser: { access_token: string; userId: string } =
						JSON.parse(loggedInUser);
					const { success, response } = await getUser(
						foundUser.access_token,
						foundUser.userId,
					);
					if (success) {
						setUserContext({
							access_token: foundUser.access_token,
							user: response,
						});
					} else {
						logout();
						await router.replace('/');
					}
				} else {
					await router.replace('/');
				}
			}
		}
		checkAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Page>{children}</Page>;
}
