import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../store/auth/auth.slice';

export const useToken = () => {
	const token = useSelector(selectCurrentToken);

	return useMemo(() => ({ token }), [token]);
};
