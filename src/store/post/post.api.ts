import { CommentRequest, IComment, IFile, IPost } from '../../models';
import { api } from '../api';

function providesList<R extends IPost[], T extends string>(
	result: R | undefined,
	tagType: T
) {
	return result
		? [
				...result.map(({ _id }) => ({
					type: tagType,
					id: _id,
				})),
				{ type: tagType, id: 'LIST' },
		  ]
		: [{ type: tagType, id: 'LIST' }];
}

const postApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllPost: builder.query<IPost[], void>({
			query: () => ({
				url: '/posts',
			}),
			providesTags: (result) => providesList(result, 'Posts'),
			extraOptions: {
				maxRetries: 3,
			},
			// transformResponse: (res: IPost[]) => {
			// 	return res.sort((a, b) => {
			// 		return (
			// 			new Date(b.updatedAt).getTime() -
			// 			new Date(a.updatedAt).getTime()
			// 		);
			// 	});
			// },
		}),
		getPost: builder.query<IPost, string>({
			query: (id) => ({
				url: `posts/${id}`,
			}),
			providesTags: (result, error, id) => [{ type: 'Posts', id }],
			extraOptions: {
				maxRetries: 3,
			},
		}),
		addPost: builder.mutation<IPost, Partial<IPost>>({
			query: (body) => ({
				url: '/posts',
				method: 'POST',
				body,
			}),
			invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),
		updatePost: builder.mutation<IPost, Partial<IPost>>({
			query(data) {
				const { _id, ...body } = data;

				return {
					url: `posts/${_id}`,
					method: 'PUT',
					body,
				};
			},
			// Invalidates all queries that subscribe to this Post `id` only.
			// In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
			invalidatesTags: (result, error, { _id }) => [
				{ type: 'Posts', id: _id },
			],
		}),
		deletePost: builder.mutation<{ success: boolean }, string>({
			query: (id) => ({
				url: `posts/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Posts', id }],
		}),
		getLastTags: builder.query<string[], void>({
			query: () => ({
				url: '/posts/tags',
			}),
		}),
		getTag: builder.query<IPost[], string>({
			query: (tag) => ({
				url: `/tags/${tag}`,
			}),
		}),
		uploadPhoto: builder.mutation<IFile, FormData>({
			query: (file: FormData) => ({
				url: 'upload',
				method: 'POST',
				body: file,
			}),
		}),
		getLastComments: builder.query<Partial<IComment>[], void>({
			query: () => ({
				url: '/posts/comments',
			}),
		}),
		getComments: builder.query({
			query: (postId: string) => ({
				url: `/posts/${postId}/comments`,
			}),
			providesTags: (result) => providesList(result, 'Comments'),
		}),
		addComment: builder.mutation({
			query: (body: CommentRequest) => {
				return {
					url: `/posts/comments`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: () => [{ type: 'Comments', id: 'LIST' }],
		}),
		deleteComment: builder.mutation<{ success: boolean }, string>({
			query: (id) => ({
				url: `posts/comments/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Comments', id }],
		}),
	}),
	overrideExisting: false,
});

export const {
	// Posts
	useGetAllPostQuery,
	useGetPostQuery,
	useUploadPhotoMutation,
	useAddPostMutation,
	useUpdatePostMutation,
	useDeletePostMutation,
	// Tags
	useGetLastTagsQuery,
	useGetTagQuery,
	// Comments
	useGetLastCommentsQuery,
	useGetCommentsQuery,
	useAddCommentMutation,
	useDeleteCommentMutation,
} = postApi;

export default postApi;
