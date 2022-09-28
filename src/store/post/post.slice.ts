import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	posts: [],
	tags: [],
};

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
});

export const postReducer = postSlice.reducer;
export default postSlice;
