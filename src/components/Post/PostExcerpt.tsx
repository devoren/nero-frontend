import React from 'react';
import { selectPostById } from '../../store/post/normalizedPost.api';
import { useAppSelector } from '../../store/store';

import Post from './Post';

interface IPostExcerpt {
	postId: number;
	isPostLoading: boolean;
}

const PostExcerpt: React.FC<IPostExcerpt> = ({ postId, isPostLoading }) => {
	const post = useAppSelector((state) => selectPostById(state, postId))!;

	return (
		<Post
			_id={post?._id}
			key={`${post?._id}`}
			title={post?.title}
			imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
			user={post.user}
			createdAt={post.createdAt}
			viewsCount={post.viewsCount}
			commentsCount={3}
			tags={post.tags}
			isEditable
		/>
	);
};

export default PostExcerpt;
