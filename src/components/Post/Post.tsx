import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import styles from './Post.module.scss';
import { PostSkeleton } from './PostSkeleton';
import { useDeletePostMutation } from '../../store/post/post.api';
import { Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { IUser } from '../../models';
import UserInfo from '../UserInfo';

interface IPost {
	_id?: string;
	title?: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrl?: string;
	user?: Partial<IUser>;
	viewsCount?: number;
	commentsCount?: number;
	tags?: string[];
	children?: ReactNode;
	isFullPost?: boolean;
	isLoading?: boolean;
	isEditable?: boolean;
}

const Post = (props: IPost) => {
	const [deletePost] = useDeletePostMutation();
	const { user } = useAuth();

	if (props.isLoading) {
		return <PostSkeleton />;
	}

	const onClickRemove = async () => {
		try {
			const response = await deletePost(props._id!).unwrap();
			console.log(response.success);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			className={clsx(styles.root, {
				[styles.rootFull]: props.isFullPost,
			})}
		>
			{props.isEditable && (
				<div className={styles.editButtons}>
					<Link to={`/posts/${props._id}/edit`}>
						<IconButton color="primary">
							<EditIcon />
						</IconButton>
					</Link>
					<IconButton onClick={onClickRemove} color="secondary">
						<DeleteIcon />
					</IconButton>
				</div>
			)}
			{props.imageUrl && (
				<img
					className={clsx(styles.image, {
						[styles.imageFull]: props.isFullPost,
					})}
					src={props.imageUrl}
					alt={props.title}
				/>
			)}
			<div className={styles.wrapper}>
				<UserInfo
					updatedAt={props.updatedAt!}
					fullName={props.user?.fullName}
					avatarUrl={props.user?.avatarUrl}
				/>
				<div className={styles.indention}>
					<h2
						className={clsx(styles.title, {
							[styles.titleFull]: props.isFullPost,
						})}
					>
						{props.isFullPost ? (
							props.title
						) : (
							<Link to={`/posts/${props._id}`}>
								{props.title}
							</Link>
						)}
					</h2>
					<ul className={styles.tags}>
						{props.tags?.map((name) => (
							<li key={name}>
								<Link to={`/tags/${name}`}>#{name}</Link>
							</li>
						))}
					</ul>
					{props.children && (
						<div className={styles.content}>{props.children}</div>
					)}
					<div className={styles.footer}>
						<ul className={styles.postDetails}>
							<li>
								<EyeIcon />
								<span>{props.viewsCount}</span>
							</li>
							<li>
								<CommentIcon />
								<span>{props.commentsCount}</span>
							</li>
						</ul>
						{props.isFullPost && user?._id === props.user?._id && (
							<div className={styles.editPost}>
								<Link
									to={`/posts/${props._id}/edit`}
									style={{ textDecoration: 'none' }}
								>
									<Button
										variant="outlined"
										size="large"
										color="primary"
									>
										Редактировать
									</Button>
								</Link>
								<Button
									onClick={onClickRemove}
									variant="contained"
									size="large"
									color="error"
								>
									Удалить
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
