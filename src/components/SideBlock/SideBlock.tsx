import React, { ReactNode } from 'react';
import styles from './SideBlock.module.scss';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface ISideBlock {
	title: string;
	children: ReactNode;
	isPost?: boolean;
}

const SideBlock = ({ title, children, isPost }: ISideBlock) => {
	return (
		<Paper
			classes={{ root: styles.root }}
			sx={{
				display:
					title === 'Комментарии' && !isPost
						? { xs: 'none', sm: 'block' }
						: 'block',
			}}
		>
			<Typography variant="h6" classes={{ root: styles.title }}>
				{title}
			</Typography>
			{children}
		</Paper>
	);
};

export default SideBlock;
