import VarLayout from './VarLayout';
import { Variable } from '../../entities/variable';
import styles from '../../../styles/Nof1.module.css';

interface TextProps {
	variable: Variable;
}

/**
 * Component that render input for a text type variable.
 */
export default function Text({ variable }: TextProps) {
	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<div className={styles.textarea} />
		</VarLayout>
	);
}
