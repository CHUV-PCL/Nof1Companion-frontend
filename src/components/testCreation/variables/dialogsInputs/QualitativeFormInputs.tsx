import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Description, InputsProps, Name } from './inputs';

/**
 * Component that renders inputs for a qualitative type variable.
 */
export default function QualitativeFormInputs({
	register,
	t,
	validation,
}: InputsProps) {
	const { ref: inputRef, ...registerProps } = register('values', {
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
			<Grid item xs={11}>
				{t('variables.quantitative-helper-txt')}
			</Grid>
			<Grid item xs={11}>
				<TextField
					autoFocus
					id="values"
					label={t('variables.header.values')}
					type="text"
					fullWidth
					inputRef={inputRef}
					{...registerProps}
				/>
			</Grid>
		</>
	);
}
