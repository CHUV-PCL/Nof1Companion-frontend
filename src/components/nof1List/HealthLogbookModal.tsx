import { useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test } from '../../entities/nof1Test';
import { HealthLogbook } from '../healthLogbook';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import { useReactToPrint } from 'react-to-print';

interface HealthLogbookModalProps {
	open: boolean;
	handleClose: () => void;
	item: Nof1Test;
}

/**
 * Health logbook modal component.
 */
export default function HealthLogbookModal({
	open,
	handleClose,
	item,
}: HealthLogbookModalProps) {
	const { t } = useTranslation('common');
	const componentRef = useRef(null);

	/**
	 * Triggers the opening of the browser's print console.
	 */
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: t('nof1List:booklet-file-title'),
	});

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth={'lg'}>
			<AppBar
				color="inherit"
				sx={{
					position: 'relative',
					padding: '0.5rem 2rem',
				}}
			>
				<Button onClick={handlePrint}>{t('print.btn')}</Button>
				<Typography variant="body2" fontStyle="italic" fontWeight="bold">
					{t('print.warning')}
					<br />
					{t('print.warning2')}
				</Typography>
			</AppBar>
			<DialogContent sx={{ bgcolor: 'background.default' }}>
				<Paper
					variant="outlined"
					sx={{
						width: '210mm',
						padding: '18mm',
						marginX: 'auto',
					}}
				>
					<HealthLogbook ref={componentRef} test={item} />
				</Paper>
			</DialogContent>
		</Dialog>
	);
}
