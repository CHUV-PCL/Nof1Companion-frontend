import useTranslation from 'next-translate/useTranslation';
import { Variable, VariableType } from '../entities/variable';

/**
 * Returns a helper method that takes a VariableType and returns
 * the appropriate translation text for it.
 */
export const useRenderVariableType = () => {
	const { t } = useTranslation('createTest');
	return (type: VariableType) => {
		switch (type) {
			case VariableType.Text:
				return t('variables.types.txt');
			case VariableType.VAS:
				return t('variables.types.vas');
			case VariableType.Binary:
				return t('variables.types.binary');
			case VariableType.Numeric:
				return t('variables.types.numeric');
			case VariableType.Qualitative:
				return t('variables.types.qualitative');
		}
	};
};

/**
 * Returns the default available common health variables with the right translation.
 * @returns The default available common health variables.
 */
export const usePredefinedHealthVariables: () => Variable[] = () => {
	const { t } = useTranslation('createTest');
	return [
		{
			name: t('variables.predefined.side-effect'),
			type: VariableType.Text,
			desc: t('variables.predefined.side-effect-desc'),
		},
		{
			name: t('variables.predefined.problem'),
			type: VariableType.Text,
			desc: t('variables.predefined.problem-desc'),
		},
		{
			name: t('variables.predefined.backup-medic'),
			type: VariableType.Text,
			desc: t('variables.predefined.backup-medic-desc'),
		},
		{
			name: t('variables.predefined.fraction'),
			type: VariableType.Text,
			desc: t('variables.predefined.fraction-desc'),
		},
		{
			name: t('variables.predefined.interruption'),
			type: VariableType.Text,
			desc: t('variables.predefined.interruption-desc'),
		},
		{
			name: t('variables.predefined.remarks'),
			type: VariableType.Text,
			desc: t('variables.predefined.remarks-desc'),
		},
	];
};
