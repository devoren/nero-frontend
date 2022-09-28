import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CommentsBlock from '../../components/CommentsBlock';
import Post, { PostSkeleton } from '../../components/Post';
import { useAuth } from '../../hooks/useAuth';
import { useToken } from '../../hooks/useToken';
import {
	useGetPostQuery,
	useGetCommentsQuery,
} from '../../store/post/post.api';
import AddComment from '../../components/AddComment';

const PostPage = () => {
	const { id } = useParams();
	const { data: post, isLoading } = useGetPostQuery(id!);
	const { data: comments, refetch } = useGetCommentsQuery(id!);
	const { user } = useAuth();
	const { token } = useToken();

	if (isLoading) {
		return <PostSkeleton />;
	}

	if (!post) {
		return <Navigate to={'/'} replace />;
	}

	return (
		<>
			<Post
				_id={post?._id}
				title={post?.title}
				imageUrl={
					post?.imageUrl
						? `http://localhost:8000${post?.imageUrl}`
						: undefined
				}
				user={post?.user}
				createdAt={post?.createdAt}
				updatedAt={post?.updatedAt}
				viewsCount={post?.viewsCount}
				commentsCount={post?.comment?.length ?? 0}
				tags={post?.tags}
				isFullPost
			>
				<ReactMarkdown children={post.text} />
			</Post>
			<CommentsBlock items={comments} isLoading={false} refetch={refetch}>
				{token && user && (
					<AddComment postId={post._id} refetch={refetch} />
				)}
			</CommentsBlock>
		</>
	);
};
export default PostPage;
