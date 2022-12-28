import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Variable, VariableType } from '../../../entities/variable';
import TextFormInputs from './dialogsInputs/TextFormInputs';
import BinaryFormInputs from './dialogsInputs/BinaryFormInputs';
import VASFormInputs from './dialogsInputs/VASFormInputs';
import NumericFormInputs from './dialogsInputs/NumericFormInputs';
import QualitativeFormInputs from './dialogsInputs/QualitativeFormInputs';
import { defaultVariable } from '.';
import { useRenderVariableType } from '../../../hooks/variables';

interface VarDialogProps {
	open: boolean;
	defaultValue: Variable;
	editing: boolean;
	validate: (name: string) => boolean;
	handleDialogSubmit: (variable: Variable) => void;
	handleClose: () => void;
	periodLen: number;
}

/**
 * Dialog component to add or edit a monitored health variable.
 */
export default function VarDialog({
	open,
	defaultValue,
	editing,
	validate,
	handleDialogSubmit,
	handleClose,
	periodLen,
}: VarDialogProps) {
	const { t } = useTranslation('createTest');
	const selectTrad = useRenderVariableType();
	const {
		register,
		handleSubmit,
		reset,
		watch,
		control,
		formState: { isSubmitSuccessful, errors },
	} = useForm<Variable>({
		defaultValues: defaultValue,
	});

	// resets fields when successfully submitted or
	// loads variable's information when editing.
	useEffect(() => {
		if (editing) {
			reset(defaultValue); // load variable's values
		} else if (isSubmitSuccessful) {
			reset(defaultVariable);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editing, isSubmitSuccessful, reset]);

	/**
	 * Resets form inputs and closes the dialog.
	 */
	const closeDialog = () => {
		reset(defaultVariable);
		handleClose();
	};

	/**
	 * Returns the appropriate inputs according to the variable type.
	 */
	const renderInputs = () => {
		switch (watch('type')) {
			case VariableType.Text:
				return (
					<TextFormInputs
						register={register}
						t={t}
						validation={{ validate, errors }}
					/>
				);
			case VariableType.Binary:
				return (
					<BinaryFormInputs
						register={register}
						t={t}
						validation={{ validate, errors }}
					/>
				);
			case VariableType.VAS:
				return (
					<VASFormInputs
						register={register}
						t={t}
						validation={{ validate, errors }}
						periodLen={periodLen}
					/>
				);
			case VariableType.Numeric:
				return (
					<NumericFormInputs
						register={register}
						t={t}
						validation={{ validate, errors }}
						periodLen={periodLen}
					/>
				);
			case VariableType.Qualitative:
				return (
					<QualitativeFormInputs
						register={register}
						t={t}
						validation={{ validate, errors }}
					/>
				);
		}
	};

	return (
		<Dialog open={open} onClose={closeDialog}>
			<DialogTitle>{t('variables.modal-title')}</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					id="var-form"
					onSubmit={handleSubmit(handleDialogSubmit)}
					mt={1}
				>
					<Grid
						container
						justifyContent="center"
						rowSpacing={2}
						columnSpacing={4}
					>
						<Grid item xs={11}>
							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<TextField
										select
										autoFocus
										id="type"
										label={t('variables.header.type')}
										{...field}
									>
										{Object.values(VariableType).map((t) => (
											<MenuItem key={`select-${t}`} value={t}>
												{selectTrad(t)}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</Grid>
						{renderInputs()}
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog}>{t('common:button.cancel')}</Button>
				<Button type="submit" form="var-form">
					{t('common:button.add')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
