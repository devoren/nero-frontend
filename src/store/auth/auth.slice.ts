import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../models';
import { RootState } from '../store';

export type AuthState = {
	user: IUser | null;
	accessToken: string | null;
};

const initialState: AuthState = {
	user: null,
	accessToken: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<AuthState>) => {
			const { user, accessToken } = action.payload;

			state.user = user;
			state.accessToken = accessToken;
		},
		logOut: (state) => {
			state.user = null;
			state.accessToken = null;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export const authReducer = authSlice.reducer;
export default authSlice;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
