import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
	Description,
	InputsProps,
	Max,
	Min,
	Name,
	SkippedRunInDays,
} from './inputs';

/**
 * Component that renders inputs for a VAS type variable.
 */
export default function VASFormInputs({
	register,
	t,
	validation,
	periodLen,
}: InputsProps) {
	const { ref: inputRef, ...registerProps } = register('unit', {
		value: 'mm',
		shouldUnregister: true,
	});
	return (
		<>
			<Grid item xs={7}>
				<Name register={register} t={t} validation={validation} />
			</Grid>
			<Grid item xs={4}>
				<TextField
					disabled
					id="unit"
					label={t('variables.header.unit')}
					type="text"
					fullWidth
					InputLabelProps={{ shrink: true }}
					value="mm"
					inputRef={inputRef}
					{...registerProps}
				/>
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
