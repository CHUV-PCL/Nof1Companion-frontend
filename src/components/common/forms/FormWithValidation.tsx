import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import { TypeOf } from 'zod';
import { useMemo } from 'react';

export type FormInput = {
	name: string;
	trad: string;
	required?: boolean;
	size?: number;
};

type FormWithValidationProps<T> = {
	schema: any;
	inputs: FormInput[];
	btnLabel: string;
	errorMsg: string;
	onSubmit: (data: T) => void;
	defaultValues?: T;
};

/**
 * Common form component, with ZOD schema validation.
 */
export default function FormWithValidation<T>({
	schema,
	inputs,
	btnLabel,
	errorMsg,
	onSubmit,
	defaultValues,
}: FormWithValidationProps<T>) {
	type SchemaType = TypeOf<typeof schema>;

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<SchemaType>({
		resolver: zodResolver(schema),
		defaultValues: useMemo(() => defaultValues, [defaultValues]),
	});

	const helperText = (field: keyof typeof errors) => errors[field]?.message;

	/**
	 * Handle form submit.
	 * @param data Form data.
	 */
	const submitHandler: SubmitHandler<SchemaType> = (data) => {
		onSubmit(data);
	};

	return (
		<Box
			component="form"
			noValidate
			onSubmit={handleSubmit(submitHandler)}
			mt={1}
		>
			<Grid container spacing={1.3} alignItems="center" justifyContent="center">
				{inputs.map((input) => {
					return (
						<Grid
							item
							xs={12}
							sm={input.size ? input.size : 12}
							key={input.name}
						>
							<TextField
								size="small"
								required={input.required}
								fullWidth
								id={input.name}
								label={input.trad}
								error={!!errors[input.name]}
								helperText={helperText(input.name)}
								{...register(input.name)}
							/>
						</Grid>
					);
				})}
				{Object.keys(errors).length !== 0 && (
					<Grid item xs={12}>
						<Alert severity="error">{errorMsg}</Alert>
					</Grid>
				)}
				<Grid item xs={6} sm={8} md={6}>
					<Button type="submit" variant="contained" fullWidth>
						{btnLabel}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}
