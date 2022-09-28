import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField, Typography, Paper, Button } from '@mui/material';

import { useToken } from '../../../hooks/useToken';
import { LoginRequest, VerifyRequest } from '../../../models';
import {
	useLoginMutation,
	useVerifyMutation,
	useResendCodeMutation,
} from '../../../store/auth/auth.api';
import { useAppDispatch } from '../../../store/store';
import { setCredentials } from '../../../store/auth/auth.slice';
import SecondsToTime from '../../../utils/SecondsToTime';

import styles from './Login.module.scss';
import { getWithExpiry, setWithExpiry } from '../../../utils/localStorageTTL';

interface ICombine extends LoginRequest, VerifyRequest {}

const Login = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const [login] = useLoginMutation();
	const [verify] = useVerifyMutation();
	const [resendCode] = useResendCodeMutation();
	const { token } = useToken();
	const [isActive, setIsActive] = React.useState(true);
	const [seconds, setSeconds] = React.useState(60);
	const [count, setCount] = React.useState(
		getWithExpiry('loginCount')?.count ?? 1
	);
	const timerRan = React.useRef(false);

	React.useEffect(() => {
		if (timerRan.current === true) {
			let interval: string | number | NodeJS.Timeout | undefined;

			if (!isActive) {
				interval = setInterval(() => {
					setSeconds((seconds) => seconds - 1);
				}, 1000);
			}

			if (isActive || seconds === 0) {
				clearInterval(interval);
			}

			return () => clearInterval(interval);
		}
		return () => (timerRan.current = true);
	}, [seconds, isActive]);

	const {
		register,
		handleSubmit,
		setError,
		getValues,
		formState: { errors, isValid },
	} = useForm<ICombine>({
		defaultValues: {
			email: 'test@test.com',
			password: '12345',
		},
		mode: 'all',
	});

	const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
		try {
			const { user, accessToken } = await login(data).unwrap();
			setIsActive(user?.active);
			user?.active && dispatch(setCredentials({ user, accessToken }));
		} catch (err) {
			setError(
				'email',
				{
					type: 'shouldUnregister',
					message: 'Неверный логин или пароль',
				},
				{ shouldFocus: true }
			);
			console.log(err);
		}
	};

	const onVerify: SubmitHandler<VerifyRequest> = async (data) => {
		try {
			const { user, accessToken } = await verify(data).unwrap();
			console.log(user, accessToken);
			dispatch(
				setCredentials({
					user,
					accessToken,
				})
			);
		} catch (err: any) {
			setError(
				'otp',
				{
					type: 'value',
					message: 'Неверный проверочный код',
				},
				{ shouldFocus: true }
			);
			console.log(err);
		}
	};

	const handleRecovery = () => navigate('/account/recovery');

	const email = getValues('email');
	const handleResendCode = async () => {
		getWithExpiry('loginCount')?.email !== email &&
			getWithExpiry('loginCount')?.count! < 5 &&
			localStorage.removeItem('loginCount');
		if (count < 5) {
			await resendCode({
				email,
			})
				.unwrap()
				.then((res) => {
					res.message && setSeconds(60);
					setCount(count + 1);
					setWithExpiry('loginCount', count, email, 5 * 60);
					console.log(res.message);
				});
		} else {
			setError(
				'otp',
				{
					type: 'disabled',
					message:
						'Вы отправляете слишком много проверочных кодов. Пожалуйста, попробуйте позже',
				},
				{ shouldFocus: true }
			);
		}
	};

	if (token) {
		return (
			<Navigate
				to={
					location.state
						? location.state.from
							? `${location.state.from.pathname}`
							: '/'
						: '/'
				}
			/>
		);
	}

	return (
		<Paper classes={{ root: styles.root }}>
			{isActive ? (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Вход в аккаунт
					</Typography>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField
							className={styles.field}
							label="E-Mail"
							error={Boolean(errors.email?.message)}
							helperText={errors.email?.message}
							fullWidth
							{...register('email', {
								required: 'Укажите почту',
								pattern: {
									value: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
									message: 'Неверный формат почты',
								},
							})}
						/>
						<TextField
							className={styles.field}
							label="Пароль"
							type={'password'}
							fullWidth
							error={Boolean(errors.password?.message)}
							helperText={errors.password?.message}
							{...register('password', {
								required: 'Укажите пароль',
								minLength: {
									value: 8,
									message:
										'Пароль должен быть минимум 8 символов',
								},
							})}
						/>
						<Button
							type="submit"
							size="large"
							variant="contained"
							disabled={!isValid}
							fullWidth
						>
							Войти
						</Button>
						<Button
							onClick={handleRecovery}
							className={styles.resendCodeButton}
							disableRipple
						>
							<span>Забыли пароль?</span>
						</Button>
					</form>
				</>
			) : (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Подтвердите свой адрес электронной почты
					</Typography>
					<div className={styles.verifyText}>
						<span>
							Введите проверочный код, который мы отправили на
							адрес <b>{email}</b>. Если вы его не видите,
							проверьте папку со спамом
						</span>
					</div>
					<form onSubmit={handleSubmit(onVerify)}>
						<TextField
							type={'text'}
							className={styles.field}
							label={'Введите код'}
							fullWidth
							error={Boolean(errors?.otp?.message)}
							helperText={errors?.otp?.message}
							{...register('otp', {
								required: 'Введите код',
								// pattern: {
								// 	value: /^[0-9]{5,8}./g,
								// 	message: 'Неверный формат кода',
								// },
							})}
						/>
						<Button
							type="submit"
							size="large"
							variant="contained"
							fullWidth
							disabled={!getValues('otp')?.length}
						>
							Подтвердить
						</Button>
						<Button
							onClick={handleResendCode}
							className={styles.resendCodeButton}
							disableRipple
							disabled={seconds > 0}
						>
							{seconds ? (
								<span>
									Отправить повторно через{' '}
									{SecondsToTime(seconds)}
								</span>
							) : (
								<span>Отправить повторно</span>
							)}
						</Button>
					</form>
				</>
			)}
		</Paper>
	);
};

export default Login;
