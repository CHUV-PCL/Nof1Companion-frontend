import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

interface ReadOnlyFormProps {
	inputs: { name: string; value: string; label: string; size?: number }[];
}

/**
 * Common read only from component.
 */
export default function ReadOnlyForm({ inputs }: ReadOnlyFormProps) {
	return (
		<Grid
			mt={1}
			container
			spacing={1.5}
			alignItems="center"
			justifyContent="center"
		>
			{inputs.map((input) => {
				return (
					<Grid item xs={12} sm={input.size ? input.size : 12} key={input.name}>
						<TextField
							size="small"
							fullWidth
							id={input.name}
							label={input.label}
							defaultValue={input.value}
							InputProps={{
								readOnly: true,
							}}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
}
