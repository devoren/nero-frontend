import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	retry,
} from '@reduxjs/toolkit/query';
import { RootState } from './store';
import { logOut, setCredentials } from './auth/auth.slice';

const baseUrl = 'http://localhost:8000';
const baseQuery = fetchBaseQuery({
	baseUrl: baseUrl,
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const accessToken = (getState() as RootState).auth.accessToken;
		if (accessToken) {
			headers.set('authorization', `Bearer ${accessToken}`);
		}
		return headers;
	},
});

const baseQuerysWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (
		(result?.error?.status === 'PARSING_ERROR' &&
			result.error.originalStatus === 403) ||
		result.error?.data === 'Forbidden'
	) {
		console.log('sending refresh token');
		// send refresh token to get new access token
		const refreshResult = await baseQuery('/refresh', api, extraOptions);
		console.log(refreshResult);
		if (refreshResult?.data) {
			const user = (api.getState() as RootState).auth.user;
			// store the new token
			api.dispatch(
				setCredentials({
					user,
					accessToken: (refreshResult.data as any).accessToken,
				})
			);
			// retry the original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			console.log(refreshResult.error);
			api.dispatch(logOut());
		}
	} else if (
		result.error?.status === 'PARSING_ERROR' &&
		result.error.originalStatus === 401
	) {
		console.log(result.error);
		api.dispatch(logOut());
	}
	return result;
};

export const api = createApi({
	reducerPath: 'api',
	baseQuery: retry(baseQuerysWithReauth, { maxRetries: 1 }),
	tagTypes: ['Posts', 'Comments'],
	// refetchOnMountOrArgChange: true,
	refetchOnReconnect: true,
	// refetchOnFocus: true,
	endpoints: () => ({}),
});
