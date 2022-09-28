import React, { ReactNode } from 'react';
import styles from './SideBlock.module.scss';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface ISideBlock {
	title: string;
	children: ReactNode;
}

const SideBlock = ({ title, children }: ISideBlock) => {
	return (
		<Paper classes={{ root: styles.root }}>
			<Typography variant="h6" classes={{ root: styles.title }}>
				{title}
			</Typography>
			{children}
		</Paper>
	);
};

export default SideBlock;
