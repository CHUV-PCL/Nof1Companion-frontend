import { Dispatch, forwardRef, ReactElement, Ref, SetStateAction } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Nof1Test } from '../../../entities/nof1Test';
import RecapSubstances from './RecapSubstances';
import RecapDuration from './RecapDuration';
import RecapVariables from './RecapVariables';
import RecapPosologies from './RecapPosologies';
import RecapParticipants from './RecapParticipants';
import RecapClinicalInfo from './RecapClinicalInfo';
import useTranslation from 'next-translate/useTranslation';
import { useRenderStrategy } from '../../../hooks/randomStrategy';

/**
 * Modal transition animation.
 */
const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface RecapModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	item: Nof1Test;
}

/**
 * Modal recapitulating all information and parameters about the N-of-1 test.
 */
export default function RecapModal({ open, setOpen, item }: RecapModalProps) {
	const { t } = useTranslation('createTest');
	const renderStrategy = useRenderStrategy();

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={() => setOpen(false)}
			TransitionComponent={Transition}
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={() => setOpen(false)}
						aria-label="close"
					>
						<CloseIcon />
						<Typography variant="h6" ml={1}>
							{t('common:close-modal')}
						</Typography>
					</IconButton>
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Container maxWidth="lg">
					<Grid container spacing={4} pb={3}>
						<Grid item xs={12}>
							<RecapParticipants participants={item.participants} />
						</Grid>

						<Grid item xs={12}>
							<RecapClinicalInfo clinicalInfo={item.clinicalInfo} />
						</Grid>

						<Grid item xs={12} sm={6}>
							<RecapSubstances substances={item.substances} />
						</Grid>

						<Grid item xs={12} sm={6}>
							<RecapDuration
								nbPeriods={item.nbPeriods}
								periodLen={item.periodLen}
								beginningDate={item.beginningDate}
								endingDate={item.endingDate}
							/>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="h5" mb={1}>
								{t('parameters.subtitle-randomStrategy')}
							</Typography>
							<Typography>{renderStrategy(item.randomization)}</Typography>
						</Grid>

						<Grid item xs={12}>
							<RecapPosologies
								allPosologies={item.posologies}
								substances={item.substances}
							/>
						</Grid>

						<Grid item xs={12}>
							<RecapVariables variables={item.monitoredVariables} />
						</Grid>
					</Grid>
				</Container>
			</DialogContent>
		</Dialog>
	);
}
