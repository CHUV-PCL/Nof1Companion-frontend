import useTranslation from 'next-translate/useTranslation';
import { SubstancePosologies } from '../../../entities/posology';
import { Substance } from '../../../entities/substance';
import PosologyTable from '../../common/table/posologyTable';
import { MiddleDivider } from '../../common/ui';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';

interface RecapPosologiesProps {
	allPosologies: SubstancePosologies[];
	substances: Substance[];
}

/**
 * Component rendering all substances posologies.
 */
export default function RecapPosologies({
	allPosologies,
	substances,
}: RecapPosologiesProps) {
	const { t } = useTranslation('createTest');

	/**
	 * Renders the decreasing posology table, if any.
	 * @param subIndex Substance index.
	 * @param unit Substance unit.
	 * @returns The decreasing posology table.
	 */
	const renderDecreasingDosage = (subIndex: number, unit: string) => {
		const dd = substances[subIndex].decreasingDosage;
		return (
			dd && (
				<>
					<div>
						<MiddleDivider />
					</div>
					<Typography fontStyle="italic" mt={1}>
						{t('parameters.decreasing-posology.title')} :
					</Typography>
					<PosologyTable posology={dd} substanceUnit={unit} />
				</>
			)
		);
	};

	return (
		<Accordion disableGutters TransitionProps={{ unmountOnExit: true }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="h5">
					{t('parameters.subtitle-posology')}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ pt: 0 }}>
				{allPosologies.map(({ substance, unit, posologies }, index) => (
					<Stack key={`substance-posology-${index}`} spacing={1} pt={2}>
						<Divider>
							<Typography variant="h6">
								{t('parameters.substance-x', { substance })}
							</Typography>
						</Divider>

						{posologies.map(({ posology, repeatLast }, idx) => (
							<Box key={`substance-posology-data-${idx}`}>
								{idx > 0 && <MiddleDivider />}
								<Typography mb={1} fontStyle="italic">
									{t('parameters.posology-x', { x: idx + 1 })}
								</Typography>
								<PosologyTable posology={posology} substanceUnit={unit} />
								<Stack direction="row" alignItems="center" spacing={2}>
									<Radio checked={repeatLast} disableRipple />
									<Typography>
										{t('parameters.posology-repeat-switch')}
									</Typography>
								</Stack>
							</Box>
						))}
						{renderDecreasingDosage(index, unit)}
					</Stack>
				))}
			</AccordionDetails>
		</Accordion>
	);
}
