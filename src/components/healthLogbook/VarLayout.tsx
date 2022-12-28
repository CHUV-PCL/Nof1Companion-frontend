import { ReactNode } from 'react';
import styles from '../../../styles/Nof1.module.css';

interface VarLayoutProps {
	children: ReactNode;
	name: string;
	desc: string;
}

/**
 * Component that render a variable input layout.
 */
export default function VarLayout({ children, name, desc }: VarLayoutProps) {
	return (
		<div id="var-layout" className={styles.flexH}>
			<div className={styles.varTitle}>{name}</div>
			<div className={styles.varContent}>
				<p className={styles.description}>{desc}</p>
				{children}
			</div>
		</div>
	);
}
