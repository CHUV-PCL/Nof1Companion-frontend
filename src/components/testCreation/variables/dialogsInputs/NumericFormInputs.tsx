import Grid from '@mui/material/Grid';
import {
	Description,
	InputsProps,
	Max,
	Min,
	Name,
	SkippedRunInDays,
	Unit,
} from './inputs';

/**
 * Component that renders inputs for a numeric type variable.
 */
export default function NumericFormInputs({
	register,
	t,
	validation,
	periodLen,
}: InputsProps) {
	return (
		<>
			<Grid item xs={7}>
				<Name register={register} t={t} validation={validation} />
			</Grid>
			<Grid item xs={4}>
				<Unit register={register} t={t} />
			</Grid>
			<Grid item xs={11}>
				<Description register={register} t={t} />
			</Grid>
			<Grid item xs={5.5}>
				<Min register={register} t={t} />
			</Grid>
			<Grid item xs={5.5}>
				<Max register={register} t={t} />
			</Grid>
			<Grid item xs={11}>
				<SkippedRunInDays
					register={register}
					t={t}
					validation={validation}
					periodLen={periodLen}
				/>
			</Grid>
		</>
	);
}
