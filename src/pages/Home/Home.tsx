import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import {
	useGetAllPostQuery,
	useGetLastCommentsQuery,
	useGetLastTagsQuery,
} from '../../store/post/post.api';
import { useAuth } from '../../hooks/useAuth';
import TagsBlock from '../../components/TagsBlock';
import CommentsBlock from '../../components/CommentsBlock';
import { IPost } from '../../models';
import Post from '../../components/Post';

const Home = () => {
	const [value, setValue] = React.useState(0);

	const {
		data: posts,
		isLoading,
		refetch,
	} = useGetAllPostQuery(void 0, {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ isLoading, data }) => ({
			isLoading,
			data:
				value === 0
					? data
					: data?.slice().sort((a, b) => b.viewsCount - a.viewsCount),
		}),
	});

	const { data: tags, isLoading: isTagLoading } = useGetLastTagsQuery();
	const { data: comments, isLoading: isCommentLoading } =
		useGetLastCommentsQuery();

	const { user } = useAuth();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<Box
				sx={{
					display: { xs: 'block', sm: 'flex', md: 'none' },
					flexDirection: 'row',
					gap: '20px',
				}}
			>
				<TagsBlock items={tags!} isLoading={isTagLoading} />
				{comments && (
					<Box
						sx={{
							display: { xs: 'none', sm: 'flex', md: 'none' },
						}}
					>
						<CommentsBlock
							items={comments}
							isLoading={isCommentLoading}
							refetch={() => {}}
							isDelete={false}
						/>
					</Box>
				)}
			</Box>
			<Tabs
				style={{ marginBottom: 15 }}
				value={value}
				aria-label="basic tabs"
				onChange={handleChange}
			>
				<Tab label="Новые" onClick={() => refetch()} />
				<Tab label="Популярные" onClick={() => refetch()} />
			</Tabs>
			<Grid
				container
				spacing={4}
				sx={{
					display: { xs: 'block', md: 'flex' },
				}}
			>
				<Grid sm={0} md={8} item>
					{(isLoading ? [...Array(5)] : posts)?.map(
						(post: IPost, index: number) => {
							return isLoading ? (
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
									commentsCount={post.comment?.length ?? 0}
									tags={post.tags}
									isEditable={user?._id === post.user?._id}
								/>
							);
						}
					)}
				</Grid>
				<Grid md={4} item sx={{ display: { xs: 'none', md: 'block' } }}>
					<TagsBlock items={tags!} isLoading={isTagLoading} />
					{comments && (
						<CommentsBlock
							items={comments}
							isLoading={isCommentLoading}
							refetch={() => {}}
							isDelete={false}
						/>
					)}
				</Grid>
			</Grid>
		</>
	);
};
export default Home;
