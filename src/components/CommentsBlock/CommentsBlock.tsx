import React, { ReactNode } from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './CommentsBlock.module.scss';
import { IComment } from '../../models';
import { useDeleteCommentMutation } from '../../store/post/post.api';
import { useAuth } from '../../hooks/useAuth';
import SideBlock from '../SideBlock';

interface ICommentBlock {
	items: Partial<IComment>[];
	children?: ReactNode;
	isLoading?: boolean;
	refetch: () => void;
	isDelete?: boolean;
}
const CommentsBlock = ({
	items,
	children,
	isLoading = true,
	refetch,
	isDelete = true,
}: ICommentBlock) => {
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
		<SideBlock title="Комментарии">
			<List>
				{(isLoading ? [...Array(5)] : items)?.map(
					(obj: IComment, index) => (
						<div key={index} className={styles.comment}>
							<ListItem alignItems="flex-start">
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
											display: 'flex',
											flexDirection: 'column',
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
											display: 'flex',
											flexDirection: 'column',
											width: '100%',
										}}
									>
										<ListItemText
											primary={obj.user?.fullName}
											secondary={obj.text}
											style={{ marginBottom: 0 }}
											secondaryTypographyProps={{
												color: '#000000DE',
											}}
										/>
										<p
											style={{
												fontSize: '0.8rem',
												color: '#939393',
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
							</ListItem>
							<Divider variant="inset" component="li" />
						</div>
					)
				)}
			</List>
			{children}
		</SideBlock>
	);
};

export default CommentsBlock;
