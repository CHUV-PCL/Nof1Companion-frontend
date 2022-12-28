import useTranslation from 'next-translate/useTranslation';
import { AnalyseType } from '../utils/statistics';

/**
 * Returns a helper method that takes an AnalyseType and returns
 * the appropriate translation text for the type of analysis.
 */
export const useAnalysisSelect = () => {
	const { t } = useTranslation('common');
	return (type: AnalyseType) => {
		switch (type) {
			case AnalyseType.NaiveANOVA:
				return t('statistics.NaiveANOVA');
			case AnalyseType.CycleANOVA:
				return t('statistics.CycleANOVA');
			case AnalyseType.ANCOVAautoregr:
				return t('statistics.ANCOVAautoregr');
		}
	};
};
