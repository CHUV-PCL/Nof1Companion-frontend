import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { MutableRefObject, useState } from 'react';
import { IParticipants } from '../../../entities/nof1Test';
import { defaultPhysician } from '../../../entities/people';
import { SectionCard } from '../../common/ui';
import PatientForm from './PatientForm';
import PharmaForm from './PharmaForm';
import PhysicianForm from './PhysicianForm';

interface ParticipantsProps {
	participants: MutableRefObject<IParticipants>;
}

/**
 * Participants section component. Render forms for each participant.
 */
export default function Participants({ participants }: ParticipantsProps) {
	const { t } = useTranslation('createTest');
	const [showAttendingPhysician, setShowAttendingPhysician] = useState(
		participants.current.attendingPhysician !== undefined,
	);

	return (
		<SectionCard>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h5" fontWeight="bold">
						{t('participants.title')}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PatientForm participants={participants} />
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PhysicianForm
						header={t('participants.requestingPhysician')}
						physician={() => participants.current.requestingPhysician}
						setPhysician={(physician) => {
							participants.current.requestingPhysician = physician;
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PharmaForm participants={participants} />
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					{showAttendingPhysician ? (
						<>
							<PhysicianForm
								header={t('participants.attendingPhysician')}
								physician={() => participants.current.attendingPhysician!}
								setPhysician={(physician) => {
									participants.current.attendingPhysician = physician;
								}}
							/>
							<Button
								variant="outlined"
								color="error"
								onClick={() => {
									delete participants.current.attendingPhysician;
									setShowAttendingPhysician(false);
								}}
								sx={{ mt: 1 }}
							>
								{t('common:button.delete')}
							</Button>
						</>
					) : (
						<Button
							variant="outlined"
							onClick={() => {
								participants.current.attendingPhysician = defaultPhysician();
								setShowAttendingPhysician(true);
							}}
						>
							{t('participants.btn-add-attendingPhysician')}
						</Button>
					)}
				</Grid>
			</Grid>
		</SectionCard>
	);
}
