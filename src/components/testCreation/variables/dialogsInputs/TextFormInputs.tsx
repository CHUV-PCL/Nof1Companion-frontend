import Grid from '@mui/material/Grid';
import { Description, InputsProps, Name } from './inputs';

/**
 * Component that renders inputs for a text type variable.
 */
export default function TextFormInputs({
	register,
	t,
	validation,
}: InputsProps) {
	return (
		<>
			<Grid item xs={7}>
				<Name register={register} t={t} validation={validation} />
			</Grid>
			<Grid item xs={4}></Grid>
			<Grid item xs={11}>
				<Description register={register} t={t} />
			</Grid>
		</>
	);
}
