import { forwardRef } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import {
	ValueType,
	NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import useTranslation from 'next-translate/useTranslation';
import { TestData } from '../../../entities/nof1Data';
import { Variable } from '../../../entities/variable';
import { formatGraphData } from '../../../utils/charts';
import { chartsColors } from '../../../utils/constants';

interface Props {
	width?: string | number;
	height?: string | number;
	customTooltip?: ContentType<ValueType, NameType>;
	testData: TestData;
	variable: Variable;
	periodLen: number;
	substancesNames: string[];
}

/**
 * Line chart component, rendering a line chart for the given data.
 */
const CustomLineChart = forwardRef<any, Props>(
	(
		{
			width = '100%',
			height = '100%',
			customTooltip,
			testData,
			variable,
			periodLen,
			substancesNames,
		},
		ref,
	) => {
		const { t } = useTranslation('common');
		const data = formatGraphData(testData, variable);

		return (
			<ResponsiveContainer width={width} height={height}>
				<LineChart
					data={data}
					ref={ref}
					margin={{ top: 5, right: 5, left: 5, bottom: 15 }}
				>
					{substancesNames.map((s, idx) => (
						<Line
							key={s}
							isAnimationActive={false}
							type="linear"
							dataKey={s}
							stroke={chartsColors[idx]}
						/>
					))}
					<XAxis
						dataKey="day"
						label={{
							value: t('days'),
							offset: -1,
							position: 'bottom',
						}}
					/>
					<YAxis
						label={{ value: variable.unit, angle: -90, position: 'insideLeft' }}
						type="number"
						domain={
							Number(variable.min) && Number(variable.max)
								? [Number(variable.min), Number(variable.max)]
								: [0, 'auto']
						}
					/>
					{customTooltip && <Tooltip content={customTooltip} />}
					<Legend verticalAlign="top" />
				</LineChart>
			</ResponsiveContainer>
		);
	},
);

CustomLineChart.displayName = 'CustomLineChart';

export default CustomLineChart;
