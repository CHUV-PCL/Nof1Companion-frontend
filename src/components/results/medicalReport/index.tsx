import { ChangeEvent, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import useTranslation from 'next-translate/useTranslation';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { useReactToPrint } from 'react-to-print';
import ReportToPrint from './ReportToPrint';
import { AnalyseType } from '../../../utils/statistics';

interface MedicalReportModalProps {
	open: boolean;
	handleClose: () => void;
	item: Nof1Test;
	testData: TestData;
	analysisType: AnalyseType;
}

/**
 * Health logbook modal component.
 */
export default function MedicalReportModal({
	open,
	handleClose,
	item,
	testData,
	analysisType,
}: MedicalReportModalProps) {
	const { t } = useTranslation('results');
	const componentRef = useRef(null);
	const [file, setFile] = useState<string | undefined>();

	/**
	 * Handles image/logo upload.
	 * @param e Html event.
	 */
	const handleImgUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setFile(URL.createObjectURL(e.target.files[0]));
	};

	/**
	 * Triggers the opening of the browser's print console.
	 */
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: t('report.file-title'),
	});

	return (
		<Dialog fullScreen open={open} onClose={handleClose}>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						ml={1}
						mr={4}
						sx={{ flexGrow: 1, maxWidth: '30%' }}
					>
						{t('common:button.close')}
					</Typography>
					<Stack direction="row" alignItems="center" spacing={4} mx={'auto'}>
						<Button
							variant="contained"
							color="invert"
							onClick={handlePrint}
							sx={{ minWidth: 260 }}
						>
							{t('common:print.btn')}
						</Button>
						<Typography
							variant="body2"
							fontStyle="italic"
							sx={{ maxWidth: 500 }}
						>
							{t('common:print.warning')}
						</Typography>
					</Stack>
				</Toolbar>
			</AppBar>
			<DialogContent sx={{ bgcolor: 'background.default' }}>
				<Typography
					fontStyle="italic"
					mb={2}
					sx={{ maxWidth: '210mm', marginX: 'auto' }}
				>
					{t('report.info')}
					<br />
					{t('report.info-1')}
					<br />
					{t('report.info-2')}
					<br />
					{t('report.info-3')}
				</Typography>
				<Paper
					sx={{
						width: '210mm',
						minHeight: '297mm',
						paddingX: '17mm',
						paddingY: '10mm',
						marginX: 'auto',
					}}
				>
					<Button component="label" size="small">
						{t('report.upload-img')}
						<input
							hidden
							accept="image/png, image/jpeg"
							type="file"
							onChange={handleImgUpload}
						/>
					</Button>
					<ReportToPrint
						ref={componentRef}
						test={item}
						testData={testData}
						analysisType={analysisType}
						logo={file}
					/>
				</Paper>
			</DialogContent>
		</Dialog>
	);
}
