import { useMemo } from 'react';
import { IUser } from '../models';
import { selectCurrentUser } from '../store/auth/auth.slice';
import { useAppSelector } from '../store/store';

export const useAuth = () => {
	const user: IUser = useAppSelector(selectCurrentUser);

	return useMemo(() => ({ user }), [user]);
};
