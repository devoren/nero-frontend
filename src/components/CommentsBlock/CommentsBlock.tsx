import React, { memo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { IconButton, ListItemButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./CommentsBlock.module.scss";
import { IComment } from "../../models";
import { useDeleteCommentMutation } from "../../store/post/post.api";
import { useAuth } from "../../hooks/useAuth";
import SideBlock from "../SideBlock";

interface ICommentBlock {
	items: Partial<IComment>[];
	children?: ReactNode;
	isLoading: boolean;
	refetch: () => void;
	isDelete?: boolean;
	isPost?: boolean;
}
const CommentsBlock = ({
	items,
	children,
	isLoading = true,
	refetch,
	isDelete = true,
	isPost = false,
}: ICommentBlock) => {
	const navigate = useNavigate();
	const [deleteComment] = useDeleteCommentMutation();
	const { user } = useAuth();

	const onDelete = async (id: string) => {
		try {
			const response = await deleteComment(id).unwrap();
			console.log(response);
			response.success && refetch();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<SideBlock title="Комментарии" isPost={isPost}>
			<List>
				{(isLoading ? [...Array(5)] : items)?.map(
					(obj: IComment, index) => (
						<ListItem
							alignItems="flex-start"
							key={`${items ? Math.random() * Math.PI : index}`}
							className={styles.comment}
							disablePadding
						>
							<ListItemButton
								onClick={() =>
									!isDelete &&
									navigate(`/posts/${obj.post._id}`)
								}
								className={
									isDelete
										? styles.unclickable__button
										: styles.clickable__button
								}
								disableRipple={isDelete}
							>
								<ListItemAvatar>
									{isLoading ? (
										<Skeleton
											variant="circular"
											width={40}
											height={40}
										/>
									) : (
										<Avatar
											alt={obj.user?.fullName}
											src={obj.user?.avatarUrl}
										/>
									)}
								</ListItemAvatar>
								{isLoading ? (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Skeleton
											variant="text"
											height={25}
											width={120}
										/>
										<Skeleton
											variant="text"
											height={18}
											width={230}
										/>
									</div>
								) : (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											width: "100%",
										}}
									>
										<ListItemText
											primary={obj.user?.fullName}
											secondary={obj.text}
											style={{
												marginBottom: 0,
											}}
											secondaryTypographyProps={{
												color: "#000000DE",
											}}
										/>
										<p
											style={{
												fontSize: "0.8rem",
												color: "#939393",
												marginBottom: 0,
											}}
										>
											{new Date(
												obj.createdAt!
											).toLocaleString()}
										</p>
									</div>
								)}
								{isDelete && obj.user?._id === user?._id && (
									<IconButton
										color="error"
										onClick={() => onDelete(obj._id)}
										className={styles.delete}
									>
										<DeleteIcon />
									</IconButton>
								)}
							</ListItemButton>
							{isDelete && index !== items.length - 1 && (
								<Divider className={styles.divider} />
							)}
						</ListItem>
					)
				)}
			</List>
			{children}
		</SideBlock>
	);
};

export default memo(CommentsBlock);
