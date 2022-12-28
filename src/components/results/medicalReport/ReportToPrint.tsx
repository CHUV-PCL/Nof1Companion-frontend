import { forwardRef, ReactNode } from 'react';
import useTranslation from 'next-translate/useTranslation';
import styles from '../../../../styles/ReportToPrint.module.css';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import { AnalyseType, anova } from '../../../utils/statistics';
import { useAnalysisSelect } from '../../../hooks/analysisSelect';
import CustomLineChart from '../lineChart/LineChart';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

dayjs.extend(LocalizedFormat);

/**
 * Generate the rows of the table.
 * @param test N-of-1 test.
 * @param testData N-of-1 test data.
 * @param analysisType Type of statistical analysis.
 * @returns An array of table row.
 */
const generateRows = (
	test: Nof1Test,
	testData: TestData,
	analysisType: AnalyseType,
) => {
	return test.monitoredVariables
		.filter(
			(variable) =>
				variable.type === VariableType.Numeric ||
				variable.type === VariableType.VAS,
		)
		.map((variable, idx) => {
			const stats = anova(
				analysisType,
				{
					name: variable.name,
					skippedRunInDays: variable.skippedRunInDays ?? 0,
				},
				test,
				testData,
			);
			return [
				<td key={`${variable.name}${idx++}`}>{variable.name}</td>,
				[
					...test.substances.map((_, idx) => (
						<td key={`${variable.name}${idx++}`}>
							{stats.treatment.effect[idx].toFixed(3)}
						</td>
					)),
				],
				<td key={`${variable.name}${idx++}`}>
					{stats.treatment.P.toFixed(8)}
				</td>,
			];
		});
};

interface EditableProps {
	children?: ReactNode;
	style?: string;
}

const Editable = ({ children, style }: EditableProps) => {
	return (
		<p
			className={`${styles.editable} ${style}`}
			contentEditable={true}
			suppressContentEditableWarning={true}
			// only using children to set the default value and
			// content only used when printing. Thus, not a problem to
			// lose/not track the changes (React independent).
		>
			{children}
		</p>
	);
};

const EditableSubtitle = ({ children, style }: EditableProps) => {
	return <Editable style={`${styles.subtitle} ${style}`}>{children}</Editable>;
};

const EditableTextarea = ({ children, style }: EditableProps) => {
	return (
		<Editable style={`${styles.editableTextarea} ${style}`}>
			{children}
		</Editable>
	);
};

interface ReportToPrintProps {
	test: Nof1Test;
	testData: TestData;
	analysisType: AnalyseType;
	logo: string | undefined;
}

/**
 * Component that render the medical report to be printed.
 */
const ReportToPrint = forwardRef<HTMLDivElement, ReportToPrintProps>(
	({ test, testData, analysisType, logo }, ref) => {
		const { t, lang } = useTranslation('results');
		const substancesNames = test.substances.map((sub) => sub.name);
		const headers = [
			t('report.result-table.criterion'),
			...test.substances.flatMap((sub) => [
				t('report.result-table.mean-sub', {
					substance: sub.name,
					unit: sub.unit,
				}),
			]),
			t('report.result-table.p-value'),
		];
		const rows = generateRows(test, testData, analysisType);
		const selectAnalysisTrad = useAnalysisSelect();

		return (
			<div ref={ref} className={styles.printContainer}>
				{/* using a table element to have the footer on each page and not overlapping the content */}
				<table>
					<tbody>
						<tr>
							<td>
								<div>
									{logo && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={logo}
											alt="institution_logo"
											className={styles.image}
										/>
									)}
								</div>
								<header className={styles.head}>
									<EditableTextarea style={styles.sender}>
										{test.participants.nof1Physician.institution}
										<br />
										{test.participants.nof1Physician.lastname}{' '}
										{test.participants.nof1Physician.firstname}
										<br />
										{test.participants.nof1Physician.address.street}
										<br />
										{test.participants.nof1Physician.address.zip}{' '}
										{test.participants.nof1Physician.address.city}
									</EditableTextarea>
									<EditableTextarea style={styles.recipient}>
										{test.participants.nof1Physician.institution}
										<br />
										{test.participants.requestingPhysician.lastname}{' '}
										{test.participants.requestingPhysician.firstname}
										<br />
										{test.participants.requestingPhysician.address.street}
										<br />
										{test.participants.requestingPhysician.address.zip}{' '}
										{test.participants.requestingPhysician.address.city}
									</EditableTextarea>
								</header>

								<main>
									<Editable style={styles.today}>
										{t('report.today', {
											city: test.participants.nof1Physician.address.city,
											date: dayjs().locale(lang).format('LL'),
										})}
									</Editable>
									<EditableSubtitle>
										{t('report.object', {
											patient: `${test.participants.patient.lastname} ${test.participants.patient.firstname}`,
											year: test.participants.patient.birthYear,
										})}
									</EditableSubtitle>
									<section>
										<Editable>{t('report.dear')}</Editable>
										<EditableTextarea>
											{t('report.intro', {
												startDate: dayjs(test.beginningDate)
													.locale(lang)
													.format('LL'),
												endDate: dayjs(test.endingDate)
													.locale(lang)
													.format('LL'),
												substances: `[${substancesNames.join(', ')}]`,
												nbPeriods: test.nbPeriods,
												periodLen: test.periodLen,
											})}
										</EditableTextarea>
									</section>

									<section className={styles.avoidBreak}>
										<EditableSubtitle>{t('report.sequence')}</EditableSubtitle>
										<p>
											{t('period-duration')} {test.periodLen} {t('common:days')}
											.
										</p>
										<div className={styles.periods}>
											{test.substancesSequence!.map((abbrev, idx) => (
												<div key={idx} className={styles.flexItem}>
													<div
														className={`${styles.boxedText} ${styles.subtitle}`}
													>
														{t('common:period')} {idx + 1}
													</div>
													<div className={styles.boxedText}>
														{
															test.substances.find(
																(s) => s.abbreviation === abbrev,
															)?.name
														}
													</div>
												</div>
											))}
										</div>
									</section>

									<section>
										<EditableSubtitle>{t('report.method')}</EditableSubtitle>
										<EditableTextarea>
											{t('report.method-desc')}
										</EditableTextarea>
										{analysisType !== test.statistics.analysisToPerform && (
											<p>
												{t('report.method-choice2', {
													analysis: selectAnalysisTrad(
														test.statistics.analysisToPerform,
													),
												})}
											</p>
										)}
										<p>
											{t('report.method-choice', {
												analysis: selectAnalysisTrad(analysisType),
											})}
										</p>
									</section>

									<section className={styles.avoidBreak}>
										<EditableSubtitle>{t('report.results')}</EditableSubtitle>
										<table className={styles.resultTable}>
											<thead>
												<tr>
													{headers.map((header, index) => (
														<th key={`var-header-${index}`}>{header}</th>
													))}
												</tr>
											</thead>
											<tbody>
												{rows.map((row, index) => (
													<tr key={index}>{row}</tr>
												))}
											</tbody>
										</table>
									</section>

									<section>
										<EditableSubtitle>
											{t('report.conclusion')}
										</EditableSubtitle>
										<EditableTextarea style={styles.conclusion}>
											{t('report.conclusion-placeholder')}
										</EditableTextarea>
										<div className={styles.signatures}>
											<Editable style={styles.signature}> </Editable>
											<Editable style={styles.signature}> </Editable>
											<Editable style={styles.signature}> </Editable>
											<Editable style={styles.signature}> </Editable>
											<Editable style={styles.signature}>
												Dr. {test.participants.nof1Physician.firstname[0]}.{' '}
												{test.participants.nof1Physician.lastname}
											</Editable>
										</div>
									</section>

									<section>
										<div className={styles.avoidBreak}>
											<EditableSubtitle>
												{t('report.results-details')}
											</EditableSubtitle>
											<Editable>{t('title.graph')} :</Editable>
										</div>
										{testData ? (
											test.monitoredVariables
												.filter(
													(v) =>
														v.type === VariableType.Numeric ||
														v.type === VariableType.VAS,
												)
												.map((v) => (
													<div
														key={v.name}
														className={`${styles.graph} ${styles.avoidBreak}`}
													>
														<div className={styles.graphTitle}>{v.name}</div>
														<CustomLineChart
															height={190}
															testData={testData}
															variable={v}
															periodLen={test.periodLen}
															substancesNames={substancesNames}
														/>
													</div>
												))
										) : (
											<p>{t('no-data')}</p>
										)}
									</section>
									<div>
										<EditableTextarea style={styles.conclusion}>
											{t('report.free-textarea')}
										</EditableTextarea>
									</div>
								</main>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>
								<div className={styles.footerSpace}>&nbsp;</div>
							</td>
						</tr>
					</tfoot>
				</table>
				<footer className={styles.footer}>{t('common:footer.report')}</footer>
			</div>
		);
	},
);

ReportToPrint.displayName = 'ReportToPrint';

export default ReportToPrint;
