import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToken } from '../hooks/useToken';

export function PrivateOutlet() {
	const { user } = useAuth();
	const { token } = useToken();
	const location = useLocation();

	return user && token ? (
		<Outlet />
	) : (
		<Navigate to="/account/login" state={{ from: location }} />
	);
}
