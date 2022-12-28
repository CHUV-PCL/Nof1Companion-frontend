import { FC } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TypographyWLineBreak } from '../../common/ui';

interface OptionBtnProps extends ButtonProps {
	width?: number;
	tooltipText?: string;
}

/**
 * Custom Button component for the options button.
 * @param children ReactElement.
 * @param variant Variant ButtonProps.
 * @param tooltipText Text for the tooltip component.
 * @param width Button width.
 * @param props Button props.
 * @returns A Button component.
 */
const OptionBtn: FC<OptionBtnProps> = ({
	children,
	variant = 'contained',
	tooltipText,
	width = 220,
	...props
}) => {
	return (
		<Button
			variant={variant}
			sx={{ width: width }}
			endIcon={
				tooltipText && (
					<Tooltip
						title={
							<TypographyWLineBreak variant="body2">
								{tooltipText}
							</TypographyWLineBreak>
						}
						arrow
					>
						<InfoOutlinedIcon fontSize="small" />
					</Tooltip>
				)
			}
			{...props}
		>
			{children}
		</Button>
	);
};
export default OptionBtn;
