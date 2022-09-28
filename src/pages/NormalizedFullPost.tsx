import React from 'react';

import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import {
	normalizedPostApi,
	selectPostById,
} from '../store/post/normalizedPost.api';
import Post, { PostSkeleton } from '../components/Post';
import CommentsBlock from '../components/CommentsBlock';
import AddComment from '../components/AddComment';

export const FullPost = () => {
	const { id } = useParams();

	const post = useAppSelector((state) => selectPostById(state, id!));
	const { isLoading } =
		normalizedPostApi.endpoints.getAllNormalizedPosts.useQueryState();

	if (isLoading) {
		return <PostSkeleton />;
	}

	return (
		<>
			<Post
				_id={post?._id}
				title={post?.title}
				imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
				user={post?.user}
				createdAt={post?.createdAt}
				viewsCount={post?.viewsCount}
				commentsCount={3}
				tags={post?.tags}
				isFullPost
			>
				<p>
					Hey there! 👋 I'm starting a new series called "Roast the
					Code", where I will share some code, and let YOU roast and
					improve it. There's not much more to it, just be polite and
					constructive, this is an exercise so we can all learn
					together. Now then, head over to the repo and roast as hard
					as you can!!
				</p>
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl:
								'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
					},
					{
						user: {
							fullName: 'Иван Иванов',
							avatarUrl:
								'https://mui.com/static/images/avatar/2.jpg',
						},
						text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
					},
				]}
				isLoading={false}
				refetch={() => {}}
			>
				<AddComment postId={post?._id} refetch={() => {}} />
			</CommentsBlock>
		</>
	);
};
