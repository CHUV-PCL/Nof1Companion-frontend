import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import { SubmitHandler } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import {
	usePhysicianSchema,
	PhysicianFormData,
} from '../utils/zodValidationHook';
import {
	formatPhysicianData,
	formatPhysicianDataToForm,
} from '../utils/dataFormConvertor';
import { updatePhysician } from '../utils/nof1-lib/api-calls/apiPhysicians';
import {
	updateUserEmail,
	userExists,
} from '../utils/nof1-lib/api-calls/apiUsers';
import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import { FormCard } from '../components/common/ui';
import FormWithValidation, {
	FormInput,
} from '../components/common/forms/FormWithValidation';
import SuccessSnackbar from '../components/common/ui/SuccessSnackbar';
import FailSnackbar from '../components/common/ui/FailSnackbar';

/**
 * Profile page.
 */
export default function Profile() {
	const { t } = useTranslation('common');
	const { userContext, setUserContext } = useUserContext();
	const schema = usePhysicianSchema();
	const [loading, setLoading] = useState(true);
	const [defaultValues, setDefaultValues] = useState<
		PhysicianFormData | undefined
	>(userContext.user ? formatPhysicianDataToForm(userContext.user) : undefined);
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);
	const [userAlreadyExists, setUserAlreadyExists] = useState(false);

	// fetch user data if needed.
	useEffect(() => {
		if (defaultValues !== undefined) {
			setLoading(false);
		} else if (userContext.user) {
			setDefaultValues(formatPhysicianDataToForm(userContext.user));
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userContext]);

	/**
	 * Handle the click on the submit button.
	 * It checks if the data has changed and need to be updated.
	 * @param data User data from the form.
	 */
	const handleSubmit: SubmitHandler<PhysicianFormData> = async (data) => {
		const { success, exists } = await userExists(data.email);
		const sameEmail = data.email === userContext.user?.email;
		if (sameEmail || (success && !exists)) {
			const physicianUpdate = formatPhysicianData(data);
			const { success } = await updatePhysician(
				userContext.access_token,
				physicianUpdate._id!,
				physicianUpdate,
			);
			let userUpdateSuccess = true;
			if (!sameEmail && success) {
				// update user account email if necessary
				const { success } = await updateUserEmail(userContext.access_token, {
					email: userContext.user!.email,
					newEmail: physicianUpdate.email,
				});
				if (!success) userUpdateSuccess = false;
			}
			if (success && userUpdateSuccess) {
				// update userCtx
				const newUserCtx = { ...userContext };
				newUserCtx.user = physicianUpdate;
				setUserAlreadyExists(false);
				setOpenSuccessSnackbar(true);
				setUserContext(newUserCtx);
			} else {
				setOpenFailSnackbar(true);
			}
		} else {
			setUserAlreadyExists(true);
		}
	};

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'institution', trad: t('form.institution'), required: true },
		{ name: 'firstname', trad: t('form.firstname'), required: true, size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), required: true, size: 6 },
		{ name: 'phone', trad: t('form.phone'), required: true },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 4 },
		{ name: 'city', trad: t('form.city'), size: 8 },
		{ name: 'country', trad: t('form.country') },
	];

	return (
		<AuthenticatedPage>
			<Grid
				container
				rowSpacing={3}
				justifyContent="center"
				alignItems="center"
			>
				<Grid item xs={12}>
					<Typography variant="h5" textAlign="center">
						{t('profile:title')}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h6" textAlign="center">
						{t('profile:welcome')}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={9} md={7}>
					{loading ? (
						<Skeleton variant="rectangular" animation="wave" height={'50vh'} />
					) : (
						<FormCard>
							{userAlreadyExists && (
								<Alert severity="error">
									{t('formErrors.userAlreadyExists2')}
								</Alert>
							)}
							<FormWithValidation<PhysicianFormData>
								schema={schema}
								inputs={inputs}
								btnLabel={t('button.save')}
								errorMsg={t('formErrors.errorMsg')}
								onSubmit={handleSubmit}
								defaultValues={defaultValues}
							/>
						</FormCard>
					)}
				</Grid>
			</Grid>
			<SuccessSnackbar
				open={openSuccessSnackbar}
				setOpen={setOpenSuccessSnackbar}
				msg={t('formErrors.successMsg')}
			/>
			<FailSnackbar
				open={openFailSnackbar}
				setOpen={setOpenFailSnackbar}
				msg={t('formErrors.unexpectedErrorMsg')}
			/>
		</AuthenticatedPage>
	);
}
