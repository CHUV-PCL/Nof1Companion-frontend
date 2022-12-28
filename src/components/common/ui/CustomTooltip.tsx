import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TypographyWLineBreak } from '.';

type TooltipRightProps = {
	infoText: string;
	placement?: TooltipProps['placement'];
	color?: SvgIconProps['color'];
};

export default function CustomTooltip({
	infoText,
	placement = 'right',
	color = 'primary',
}: TooltipRightProps) {
	return (
		<Tooltip
			title={
				<TypographyWLineBreak variant="body2">{infoText}</TypographyWLineBreak>
			}
			placement={placement}
			arrow
		>
			<InfoOutlinedIcon
				color={color}
				fontSize="small"
				sx={{ verticalAlign: 'text-bottom' }}
			/>
		</Tooltip>
	);
}
