import {
	ChangePwdRequest,
	ChangePwdResponse,
	LoginRequest,
	LoginResponse,
	RecoveryRequest,
	RecoveryResponse,
	ResendCodeRequest,
	ResendCodeResponse,
	SignUpRequest,
	SignUpResponse,
	VerifyRequest,
	VerifyResponse,
} from '../../models';
import { api } from '../api';

const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (body) => ({
				url: '/auth/login',
				method: 'POST',
				body,
			}),
		}),
		logout: builder.mutation<any, void>({
			query: () => ({
				url: '/logout',
			}),
		}),
		signUp: builder.mutation<SignUpResponse, SignUpRequest>({
			query: (body) => ({
				url: '/auth/register',
				method: 'POST',
				body,
			}),
		}),
		refresh: builder.mutation<any, void>({
			query: () => ({
				url: '/refresh',
			}),
		}),
		verify: builder.mutation<VerifyResponse, VerifyRequest>({
			query: (body) => ({
				url: '/auth/verify',
				method: 'POST',
				body,
			}),
		}),
		resendCode: builder.mutation<ResendCodeResponse, ResendCodeRequest>({
			query: (body) => ({
				url: '/auth/resendCode',
				method: 'POST',
				body,
			}),
		}),
		recovery: builder.mutation<RecoveryResponse, RecoveryRequest>({
			query: (body) => ({
				url: '/auth/recovery',
				method: 'POST',
				body,
			}),
		}),
		changePassword: builder.mutation<ChangePwdResponse, ChangePwdRequest>({
			query: (body) => ({
				url: `/auth/recovery/${body.userId}/${body.token}`,
				method: 'POST',
				body: { password: body.password },
			}),
		}),
	}),
	overrideExisting: false,
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useSignUpMutation,
	useRefreshMutation,
	useVerifyMutation,
	useResendCodeMutation,
	useRecoveryMutation,
	useChangePasswordMutation,
} = authApi;

export default authApi;
