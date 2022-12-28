import { Variable } from '../../entities/variable';

/**
 * Common props interface for Variables components.
 */
export interface VarProps {
	variable: Variable;
	defaultValue: string;
	onChange: (value: string) => void;
}
