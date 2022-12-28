import { Variable } from '../../entities/variable';
import VarLayout from './VarLayout';
import styles from '../../../styles/Nof1.module.css';

interface BinaryProps {
	variable: Variable;
}

/**
 * Component that render input for a binary type variable.
 */
export default function Binary({ variable }: BinaryProps) {
	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<div className={styles.radioBox}>
				<input type="radio" id="radio1" readOnly />
				<label htmlFor="radio1">{variable.min}</label>
			</div>
			<div className={styles.radioBox}>
				<input type="radio" id="radio2" readOnly />
				<label htmlFor="radio2">{variable.max}</label>
			</div>
		</VarLayout>
	);
}
