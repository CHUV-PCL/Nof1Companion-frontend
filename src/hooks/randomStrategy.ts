import useTranslation from 'next-translate/useTranslation';
import {
	RandomizationStrategy,
	RandomStrategy,
} from '../utils/nof1-lib/randomizationStrategy';

/**
 * Returns a helper method that takes a RandomizationStrategy object and returns
 * the appropriate translation text for the randomization strategy.
 */
export const useRenderStrategy = () => {
	const { t } = useTranslation('createTest');
	return (randomization: RandomizationStrategy) => {
		switch (randomization.strategy) {
			case RandomStrategy.Permutations:
				return t('parameters.RS-permutation');
			case RandomStrategy.MaxRep:
				return `${t('parameters.RS-random-max-rep')}. ${t(
					'parameters.RS-random-max-rep-N',
				)} : ${randomization.maxRep}.`;
			case RandomStrategy.Custom:
				return t('parameters.RS-custom');
		}
	};
};
