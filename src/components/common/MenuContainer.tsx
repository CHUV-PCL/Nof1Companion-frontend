import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from '@mui/material/Typography';
import CustomTooltip from './ui/CustomTooltip';

export interface IMenuItem {
	name: string;
	color?: string;
	tooltipText?: string;
	callback: () => void;
}

interface MenuContainerProps {
	name: string;
	items: IMenuItem[];
	btnSize?: number | string;
}

const btnId = 'option-button';
const menuId = 'option-menu';

/**
 * Common Menu container component.
 */
export default function MenuContainer({
	name,
	items,
	btnSize = 'auto',
}: MenuContainerProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/**
	 * Handles click on the menu item.
	 * @param event HTML event.
	 */
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	/**
	 * Handles menu closure.
	 */
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				id={btnId}
				variant="outlined"
				aria-controls={open ? menuId : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				sx={{ width: btnSize }}
			>
				{name}
			</Button>
			<Menu
				id={menuId}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': btnId,
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				{items.map((i, idx) => {
					return (
						<MenuItem
							key={idx}
							onClick={() => {
								i.callback();
								handleClose();
							}}
						>
							{i.tooltipText ? (
								<Typography color={i.color || 'black'}>
									{i.name} <CustomTooltip infoText={i.tooltipText} />
								</Typography>
							) : (
								<Typography color={i.color || 'black'}>{i.name}</Typography>
							)}
						</MenuItem>
					);
				})}
			</Menu>
		</>
	);
}
