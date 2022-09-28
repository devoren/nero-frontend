import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import Post, { PostExcerpt } from '../components/Post';
import {
	selectPostIds,
	useGetAllNormalizedPostsQuery,
	useGetLastTagsQuery,
} from '../store/post/normalizedPost.api';
import { useAppSelector } from '../store/store';
import TagsBlock from '../components/TagsBlock';
import CommentsBlock from '../components/CommentsBlock';

export const NormalizedHome = () => {
	const { isLoading: isPostLoading } = useGetAllNormalizedPostsQuery(void 0, {
		refetchOnMountOrArgChange: true,
	});
	const { data: tags, isLoading: isTagLoading } = useGetLastTagsQuery();
	const orderedPostIds = useAppSelector(selectPostIds);

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={0}
				aria-label="basic tabs example"
			>
				<Tab label="Новые" />
				<Tab label="Популярные" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostLoading ? [...Array(5)] : orderedPostIds)?.map(
						(id: number, index) =>
							isPostLoading ? (
								<Post key={index} isLoading={true} />
							) : (
								<PostExcerpt
									key={`${index}`}
									postId={id}
									isPostLoading={isPostLoading}
								/>
							)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags!} isLoading={isTagLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl:
										'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
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
					/>
				</Grid>
			</Grid>
		</>
	);
};
