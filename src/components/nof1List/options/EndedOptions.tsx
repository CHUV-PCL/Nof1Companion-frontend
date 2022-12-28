import EndedTestMenu from '../dropDownMenus/EndedTestMenu';
import useTranslation from 'next-translate/useTranslation';
import OptionBtn from './OptionBtn';
import { OptionsProps } from '../Nof1TableItem';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';

/**
 * Component rendering the options for a test with the status ended.
 */
export default function EndedOptions({ item }: OptionsProps) {
	const { t } = useTranslation('nof1List');
	const router = useRouter();

	return (
		<>
			<OptionBtn
				onClick={() => {
					router.push({
						pathname: '/results',
						query: { id: item.uid },
					});
				}}
			>
				{t('btnStatus.ended')}
			</OptionBtn>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				spacing={2}
			>
				<OptionBtn
					variant="outlined"
					width={310}
					onClick={() => {
						router.push({
							pathname: '/import-data',
							query: { id: item.uid },
						});
					}}
				>
					{t('menu.dataImport')}
				</OptionBtn>
				<EndedTestMenu item={item} />
			</Stack>
		</>
	);
}
