import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAnalysisSelect } from '../../../hooks/analysisSelect';
import { AnalyseType } from '../../../utils/statistics';

interface SelectAnalysisTypeProps {
	value: AnalyseType;
	onChange: (event: SelectChangeEvent<AnalyseType>) => void;
}

/**
 * Custom Select component to select the statistical analysis to perform.
 */
function SelectAnalysisType({ value, onChange }: SelectAnalysisTypeProps) {
	const selectTrad = useAnalysisSelect();

	return (
		<Select id="statistic-type" size="small" value={value} onChange={onChange}>
			{Object.values(AnalyseType).map((t) => (
				<MenuItem key={t} value={t}>
					{selectTrad(t)}
				</MenuItem>
			))}
		</Select>
	);
}

export default SelectAnalysisType;
