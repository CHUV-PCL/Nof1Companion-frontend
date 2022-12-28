import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

type PageProps = {
	children: ReactNode;
};

/**
 * Page layout.
 */
export default function Page({ children }: PageProps) {
	return (
		<Box minHeight={'100vh'} display="flex" flexDirection="column">
			<NavBar />
			<Container
				component="main"
				maxWidth="lg"
				sx={{
					my: 4,
					flex: 1,
				}}
			>
				{children}
			</Container>
			<Footer />
		</Box>
	);
}
