import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import {
	persistStore,
	persistReducer,
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	PersistConfig,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import { api } from './api';
import { postReducer } from './post/post.slice';
import { authReducer } from './auth/auth.slice';

const encryptor = encryptTransform({
	secretKey: process.env.REACT_APP_SECRET_KEY!,
	onError: function (error) {
		// Handle the error.
		console.log(error);
		persistor.purge();
	},
});

const persistConfig: PersistConfig<any> = {
	key: 'root',
	storage: storage,
	version: 1,
	whitelist: ['auth'],
	transforms: [encryptor],
};

const rootReducer = combineReducers({
	post: postReducer,
	auth: authReducer,
	[api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}).concat(api.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
