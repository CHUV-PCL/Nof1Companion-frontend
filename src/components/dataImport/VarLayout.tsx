import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface VarLayoutProps {
	children: ReactNode;
	name: string;
	desc: string;
}

/**
 * Component that renders the form layout of a variable.
 */
export default function VarLayout({ children, name, desc }: VarLayoutProps) {
	return (
		<>
			<Grid item xs={12} sm={3}>
				<Typography fontWeight="bold">{name}</Typography>
			</Grid>
			<Grid item xs={12} sm={9} mb={2}>
				<Stack spacing={1} alignItems="flex-start">
					<Typography>{desc}</Typography>
					{children}
				</Stack>
			</Grid>
		</>
	);
}
