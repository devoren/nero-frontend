import { useRefreshMutation } from '../store/auth/auth.api';
import { setCredentials } from '../store/auth/auth.slice';
import { useAppDispatch } from '../store/store';
import { useAuth } from './useAuth';

const useRefreshToken = () => {
	const dispatch = useAppDispatch();
	const [refreshToken] = useRefreshMutation();
	const { user } = useAuth();

	const refresh = async () => {
		try {
			const response = await refreshToken().unwrap();
			dispatch(
				setCredentials({
					user,
					accessToken: response.accessToken,
				})
			);
			return response.accessToken;
		} catch (err) {
			console.log(err);
		}
	};
	return refresh;
};

export default useRefreshToken;
