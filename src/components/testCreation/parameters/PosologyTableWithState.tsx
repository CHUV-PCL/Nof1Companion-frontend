import Input from '@mui/material/Input';
import useTranslation from 'next-translate/useTranslation';
import { PosologyDay } from '../../../entities/posology';
import { numericInputPattern } from '../../../utils/constants';
import { StyledTableCell } from '../../common/table/customTableComponents';
import EditablePosologyTable, {
	RegisterType,
} from '../../common/table/posologyTable/EditablePosologyTable';

interface PosologyTableWithStateProps {
	rows: PosologyDay[];
	onChange: (posologyRow: number, property: string, value: number) => void;
	substanceUnit: string;
}

/**
 * Controlled posology form component, without the checkbox for repetition.
 */
export default function PosologyTableWithState({
	rows,
	onChange,
	substanceUnit,
}: PosologyTableWithStateProps) {
	const { t } = useTranslation('createTest');

	/**
	 * Renders an input TableCell component.
	 * @param name Name of the input.
	 * @param defaultValue Default value.
	 * @param borderRight Display a right border.
	 * @returns The TableCell component.
	 */
	const renderTableCell = (
		name: RegisterType,
		defaultValue: number,
		borderRight: boolean = false,
	) => {
		const [row, property] = name.split('.');
		return (
			<StyledTableCell align="center" borderR={borderRight}>
				<Input
					size="small"
					autoFocus
					id={name}
					disableUnderline
					inputProps={{
						min: 0,
						style: { textAlign: 'center' },
						inputMode: 'numeric',
						pattern: numericInputPattern,
						title: t('common:formErrors.number'),
					}}
					value={defaultValue}
					onChange={(e) =>
						onChange(Number(row), property, Number(e.target.value))
					}
				/>
			</StyledTableCell>
		);
	};

	return (
		<EditablePosologyTable
			rows={rows}
			substanceUnit={substanceUnit}
			renderTableCell={renderTableCell}
		/>
	);
}
