import { Variable } from '../../entities/variable';
import styles from '../../../styles/Nof1.module.css';
import VarLayout from './VarLayout';

interface QualitativeProps {
	variable: Variable;
}

/**
 * Component that render input for a qualitative type variable.
 */
export default function Qualitative({ variable }: QualitativeProps) {
	const inputs = variable.values!.split(';');

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			{inputs.map((input) => (
				<div key={input} className={styles.radioBox}>
					<input type="radio" id={input} readOnly />
					<label htmlFor={input}>{input}</label>
				</div>
			))}
		</VarLayout>
	);
}
