import { Variable } from '../../entities/variable';
import useTranslation from 'next-translate/useTranslation';
import VarLayout from './VarLayout';
import styles from '../../../styles/Nof1.module.css';

interface NumericProps {
	variable: Variable;
}

/**
 * Component that render input for a numeric type variable.
 */
export default function Numeric({ variable }: NumericProps) {
	const { t } = useTranslation('importData');

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<span>{t('response')}</span>
			<div className={styles.inputLine} />
			<span>{variable.unit}</span>
		</VarLayout>
	);
}
