import {
	createEntityAdapter,
	createSelector,
	EntityState,
} from '@reduxjs/toolkit';
import { IPost } from '../../models';
import { api } from '../api';
import { RootState } from '../store';

/*
Redux Toolkit's createEntityAdapter API provides a standardized way to store your data 
in a slice by taking a collection of items and putting them into the shape of { ids: [], entities: {} }
*/

/**
 * createEntityAdapter accepts an options object that may include a sortComparer function,
 * which will be used to keep the item IDs array in sorted order by comparing two items
 * (and works the same way as Array.sort()).
 */

const postAdapter = createEntityAdapter<IPost>({
	selectId: (post) => post._id,
	sortComparer: (a, b) =>
		b.createdAt.toISOString().localeCompare(a.createdAt.toISOString()),
});

/*
- We don't have to write the code to manage the normalization ourselves
- createEntityAdapter's pre-built reducer functions handle common cases like "add all these items", "update one item", or "remove multiple items"
- createEntityAdapter can keep the ID array in a sorted order based on the contents of the items,
and will only update that array if items are added / removed or the sorting order changes.
*/

/**
 * Finally, the adapter object has a getInitialState function that generates an empty {ids: [], entities: {}} object.
 * You can pass in more fields to getInitialState, and those will be merged in.
 */

const initialState = postAdapter.getInitialState();

export const normalizedPostApi = api.injectEndpoints({
	endpoints: (build) => ({
		getAllNormalizedPosts: build.query<EntityState<IPost>, void>({
			query: () => ({
				url: '/posts',
			}),
			transformResponse: (posts: IPost[]) => {
				return postAdapter.setAll(initialState, posts);
			},
			keepUnusedDataFor: 5,
			providesTags: (result) =>
				// is result available?
				result
					? // successful query
					  [
							...result.ids.map(
								(id) => ({ type: 'Posts', id } as const)
							),
							{ type: 'Posts', id: 'LIST' },
					  ]
					: // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
					  [{ type: 'Posts', id: 'LIST' }],
		}),
		getLastTags: build.query<string[], void>({
			query: () => ({
				url: '/posts/tags',
			}),
		}),
	}),
	overrideExisting: false,
});

export const { useGetAllNormalizedPostsQuery, useGetLastTagsQuery } =
	normalizedPostApi;
// returns the query result object
// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectPostsResult =
	normalizedPostApi.endpoints.getAllNormalizedPosts.select();

// Create memoized selector
const selectPostsData = createSelector(
	selectPostsResult,
	(postResult) => postResult.data
);

export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostIds,
	// Pass in a selectore that returns the posts slice of state
} = postAdapter.getSelectors(
	(state: RootState) => selectPostsData(state) ?? initialState
);
