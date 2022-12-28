import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import useTranslation from 'next-translate/useTranslation';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import VarTable from './VarTable';
import VarDialog from './VarDialog';
import { SectionCard } from '../../common/ui';
import CustomTooltip from '../../common/ui/CustomTooltip';
import { Variable, VariableType } from '../../../entities/variable';
import { usePredefinedHealthVariables } from '../../../hooks/variables';

export const defaultVariable = {
	type: VariableType.VAS,
	name: '',
	desc: '',
};

const notEditing = -1;

interface VariablesProps {
	variables: Variable[];
	setVariables: Dispatch<SetStateAction<Variable[]>>;
	periodLen: number;
	showPeriodQuestions: boolean;
	setShowPeriodQuestions: Dispatch<SetStateAction<boolean>>;
}

/**
 * Component managing the monitored health variables section.
 * Manages and displays variables in a table.
 */
export default function Variables({
	variables,
	setVariables,
	periodLen,
	showPeriodQuestions,
	setShowPeriodQuestions,
}: VariablesProps) {
	const { t } = useTranslation('createTest');
	const predefinedHealthVariables = usePredefinedHealthVariables();
	// determine the default checkboxes states.
	const defaultCheckboxes = () => {
		const state: { [key: string]: boolean } = {};
		predefinedHealthVariables.forEach((v) => (state[v.name] = false));
		return state;
	};
	const [checkboxesState, setCheckboxesState] = useState(defaultCheckboxes());
	const [openDialog, setOpenDialog] = useState(false);
	const [defaultValue, setDefaultValue] = useState<Variable>(defaultVariable);
	const [editing, setEditing] = useState(notEditing);
	// used to check editing mode and get variable's index
	const isEditing = editing !== notEditing;

	// update checkboxes state if data are loaded from an existing N-of-1 test.
	useEffect(() => {
		const state = { ...checkboxesState };
		predefinedHealthVariables.forEach((predefinedVar) => {
			const v = variables.find((v) => v.name === predefinedVar.name);
			if (v) {
				state[v.name] = true;
			}
		});
		setCheckboxesState(state);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // only when rendered for the first time

	/**
	 * Adds a new variable.
	 * @param v Variable.
	 */
	const addVariable = (v: Variable) => {
		setVariables((prevVariables) => [...prevVariables, v]);
	};

	/**
	 * Edits a variable.
	 * @param idx Index of the variable.
	 * @param v New variable information.
	 */
	const editVariable = (idx: number, v: Variable) => {
		setVariables((prevVariables) => {
			const array = [...prevVariables];
			array[idx] = v;
			return array;
		});
	};

	/**
	 * Opens the dialog to edit a variable.
	 * @param idx Index of the variable.
	 * @param v Variable.
	 */
	const openEdit = (idx: number, v: Variable) => {
		setDefaultValue(v);
		setEditing(idx);
		setOpenDialog(true);
	};

	/**
	 * Removes a variable.
	 * @param idx Index of the variable to remove.
	 */
	const removeVariable = (idx: number) => {
		const array = [...variables];
		const varRemoved = array.splice(idx, 1);
		setVariables(array);
		// update checkboxes state if needed
		const checkboxToUncheck = predefinedHealthVariables.find(
			(v) => v.name === varRemoved[0].name,
		);
		if (checkboxToUncheck) {
			setCheckboxesState({
				...checkboxesState,
				[checkboxToUncheck.name]: false,
			});
		}
	};

	/**
	 * Handles the submit action of the dialog that add or edit a variable.
	 * @param variable Variable to add or edit.
	 */
	const handleDialogSubmit = (variable: Variable) => {
		if (isEditing) {
			editVariable(editing, variable);
			setEditing(notEditing);
		} else {
			addVariable(variable);
		}
		setOpenDialog(false);
	};

	/**
	 * Handles the action to trigger when un/checking a checkboxes (add/remove).
	 * @param event HTML event.
	 */
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		setCheckboxesState({
			...checkboxesState,
			[name]: checked,
		});
		if (checked) {
			const v = predefinedHealthVariables.find((v) => v.name === name);
			if (v) addVariable(v);
		} else {
			const idx = variables.findIndex((v) => v.name === name);
			if (idx !== -1) removeVariable(idx);
		}
	};

	/**
	 * Checks for the uniqueness of a variable name.
	 * @param name Name entered.
	 * @returns True if name is allowed, otherwise false.
	 */
	const validateVarName = (name: string) =>
		(isEditing && variables.findIndex((v) => v.name === name) === editing) ||
		!variables.some((v) => v.name === name);

	return (
		<SectionCard>
			<Stack spacing={3}>
				<Typography variant="h5" fontWeight="bold">
					{t('variables.title')}
				</Typography>

				<VarTable rows={variables} removeRow={removeVariable} edit={openEdit} />

				<Stack alignItems="center">
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => setOpenDialog(true)}
					>
						{t('common:button.add')}
					</Button>
				</Stack>

				<Typography variant="h6">
					{t('variables.additional-var-subtitle')}
				</Typography>

				<FormGroup>
					<Grid
						container
						rowSpacing={2}
						alignItems="center"
						justifyContent="center"
					>
						{predefinedHealthVariables.map((v, idx) => {
							return (
								<Grid key={idx} item xs={12} sm={4}>
									<FormControlLabel
										control={
											<Checkbox
												checked={checkboxesState[v.name]}
												onChange={handleCheckboxChange}
												name={v.name}
											/>
										}
										label={v.name}
									/>
								</Grid>
							);
						})}
					</Grid>
				</FormGroup>

				<Typography variant="h6">
					{t('variables.end-period-Q.title')}
				</Typography>
				<Box paddingLeft={2} width={'95%'}>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={showPeriodQuestions}
									onChange={() =>
										setShowPeriodQuestions((prevState) => !prevState)
									}
								/>
							}
							label={
								<Typography ml={1}>
									{t('variables.end-period-Q.Q')}{' '}
									<CustomTooltip infoText={t('variables.end-period-Q.info')} />
								</Typography>
							}
						/>
					</FormGroup>
				</Box>
			</Stack>
			<VarDialog
				open={openDialog}
				defaultValue={defaultValue}
				editing={isEditing}
				validate={validateVarName}
				handleDialogSubmit={handleDialogSubmit}
				handleClose={() => {
					isEditing && setEditing(notEditing);
					setOpenDialog(false);
				}}
				periodLen={periodLen}
			/>
		</SectionCard>
	);
}
