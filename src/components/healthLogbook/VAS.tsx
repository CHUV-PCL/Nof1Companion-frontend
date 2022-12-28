import { Variable } from '../../entities/variable';
import styles from '../../../styles/Nof1.module.css';
import VarLayout from './VarLayout';

interface VASProps {
	variable: Variable;
}

/**
 * Component that render input for a VAS type variable.
 */
export default function VAS({ variable }: VASProps) {
	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<div>
				<div className={styles.line} />
				<div className={`${styles.flexH} ${styles.vasBounds}`}>
					<div>{variable.min}</div>
					<div>{variable.max}</div>
				</div>
			</div>
		</VarLayout>
	);
}
