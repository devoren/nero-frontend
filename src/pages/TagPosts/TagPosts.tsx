import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import styles from './TagPosts.module.scss';
import { useAuth } from '../../hooks/useAuth';
import { useGetTagQuery } from '../../store/post/post.api';
import { IPost } from '../../models';
import Post from '../../components/Post';

const TagPosts = () => {
	const { tag } = useParams();
	const { user } = useAuth();

	const { data: posts, isLoading } = useGetTagQuery(tag!, {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ isLoading, data }) => ({
			isLoading,
			data: data?.slice().sort((a, b) => b.viewsCount - a.viewsCount),
		}),
	});

	return (
		<main>
			<h1 className={styles.sectionHeader}>#{tag}</h1>
			<Box
				className={styles.columns}
				sx={{
					gridTemplateColumns: { sm: '1fr', md: '1fr 1fr' },
				}}
			>
				{(isLoading ? [...Array(2)] : posts)?.map(
					(post: IPost, index: number) =>
						isLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								_id={post?._id}
								key={`${post?._id}`}
								title={post?.title}
								imageUrl={
									post?.imageUrl
										? `${process.env.REACT_APP_API_URL}${post?.imageUrl}`
										: undefined
								}
								user={post.user}
								createdAt={post.createdAt}
								updatedAt={post.updatedAt}
								viewsCount={post.viewsCount}
								commentsCount={3}
								tags={post.tags}
								isEditable={user?._id === post.user?._id}
							/>
						)
				)}
			</Box>
		</main>
	);
};

export default TagPosts;
