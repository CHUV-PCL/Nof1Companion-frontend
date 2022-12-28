import VarLayout from './VarLayout';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import TextareaWithCustomValidation from '../common/inputs/TextareaWithCustomValidation';

/**
 * Component that renders an input for a text type variable.
 */
export default function Text({ variable, defaultValue, onChange }: VarProps) {
	const { t } = useTranslation('importData');
	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<TextareaWithCustomValidation
				label={t('response')}
				defaultValue={defaultValue}
				onChange={(val) => onChange(val)}
				minRows={3}
			/>
		</VarLayout>
	);
}
