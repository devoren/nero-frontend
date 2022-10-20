import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import SideBlock from "../SideBlock";

interface ITagsBlock {
	items: string[];
	isLoading?: boolean;
}
const TagsBlock = ({ items, isLoading = true }: ITagsBlock) => {
	const navigate = useNavigate();
	return (
		<SideBlock title="Тэги">
			<List>
				{(isLoading ? [...Array(5)] : items)?.map((name, i) => (
					<ListItem disablePadding key={`${Math.random() * Math.PI}`}>
						<ListItemButton
							onClick={() => navigate(`/tags/${name}`)}
						>
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
				))}
			</List>
		</SideBlock>
	);
};

export default memo(TagsBlock);
