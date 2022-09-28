import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import SideBlock from '../SideBlock';

interface ITagsBlock {
	items: string[];
	isLoading?: boolean;
}
const TagsBlock = ({ items, isLoading = true }: ITagsBlock) => {
	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? [...Array(5)] : items)?.map((name, i) => (
					<Link
						style={{ textDecoration: 'none', color: 'black' }}
						key={`${Math.random() * Math.PI}`}
						to={`/tags/${name}`}
					>
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon>
									<TagIcon />
								</ListItemIcon>
								{isLoading ? (
									<Skeleton width={100} />
								) : (
									<ListItemText primary={name} />
								)}
							</ListItemButton>
						</ListItem>
					</Link>
				))}
			</List>
		</SideBlock>
	);
};

export default TagsBlock;
