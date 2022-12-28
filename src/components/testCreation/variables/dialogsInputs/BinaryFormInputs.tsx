import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Description, InputsProps, Name } from './inputs';

/**
 * Component that renders inputs for a binary type variable.
 */
export default function BinaryFormInputs({
	register,
	t,
	validation,
}: InputsProps) {
	const { ref: inputRefMin, ...minRegisterProps } = register('min', {
		shouldUnregister: true,
	});
	const { ref: inputRefMax, ...maxRegisterProps } = register('max', {
		shouldUnregister: true,
	});
	return (
		<>
			<Grid item xs={7}>
				<Name register={register} t={t} validation={validation} />
			</Grid>
			<Grid item xs={4}></Grid>
			<Grid item xs={11}>
				<Description register={register} t={t} />
			</Grid>
			<Grid item xs={5.5}>
				<TextField
					autoFocus
					id="min"
					label={t('variables.header.0')}
					type="text"
					fullWidth
					inputRef={inputRefMin}
					{...minRegisterProps}
				/>
			</Grid>
			<Grid item xs={5.5}>
				<TextField
					autoFocus
					id="max"
					label={t('variables.header.1')}
					type="text"
					fullWidth
					inputRef={inputRefMax}
					{...maxRegisterProps}
				/>
			</Grid>
		</>
	);
}
