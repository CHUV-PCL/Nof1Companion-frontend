import { AppProps } from 'next/app';
import { UserContextProvider } from '../context/UserContext'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme'

/**
 * Main component of the application.
 */
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserContextProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</UserContextProvider>
	);
}

export default MyApp
