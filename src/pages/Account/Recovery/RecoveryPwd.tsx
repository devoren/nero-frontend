import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Typography, Paper, Button } from '@mui/material';

import { ChangePwdRequest } from '../../../models';
import { useChangePasswordMutation } from '../../../store/auth/auth.api';

import styles from './Recovery.module.scss';

const RecoveryPwd = () => {
	const { userId, token } = useParams();
	const navigate = useNavigate();
	const [changePwd] = useChangePasswordMutation();
	const [isActive, setIsActive] = React.useState(false);
	const [isError, setIsError] = React.useState(false);
	const [error, setError] = React.useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm<ChangePwdRequest>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		mode: 'all',
	});
	const password = getValues('password');
	const onSubmit: SubmitHandler<ChangePwdRequest> = async ({ password }) => {
		if (userId && token && token.length === 64) {
			try {
				const { message } = await changePwd({
					userId,
					token,
					password,
				}).unwrap();
				setIsActive(true);
				console.log(message);
			} catch (err: any) {
				setIsActive(true);
				setIsError(true);
				setError(err.data.message);
			}
		}
	};

	return (
		<Paper classes={{ root: styles.root }}>
			{!isActive ? (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Восстановление аккаунта
					</Typography>
					<div className={styles.verifyText}>
						<span>
							Выберите надежный пароль и не используйте его для
							дргуих аккаунтов
						</span>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField
							className={styles.field}
							label="Новый пароль"
							error={Boolean(errors.password?.message)}
							helperText={errors.password?.message}
							type={'password'}
							fullWidth
							{...register('password', {
								required: 'Укажите пароль',
								minLength: {
									value: 8,
									message:
										'Пароль должен быть минимум 8 символов',
								},
							})}
						/>
						<TextField
							className={styles.field}
							label="Подтверждение пароля"
							error={Boolean(errors.confirmPassword?.message)}
							helperText={errors.confirmPassword?.message}
							type={'password'}
							fullWidth
							{...register('confirmPassword', {
								validate: (value) =>
									value === password || 'Пароли не совпадают',
							})}
						/>
						<Button
							type="submit"
							size="large"
							variant="contained"
							disabled={!isValid}
							fullWidth
						>
							Сменить пароль
						</Button>
					</form>
				</>
			) : isError ? (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Ошибка при восстановлении пароля
					</Typography>
					<div className={styles.verifyText}>
						<span>{error}</span>
					</div>
					<Button
						type="submit"
						size="large"
						variant="contained"
						fullWidth
						onClick={() =>
							navigate('/', {
								replace: true,
							})
						}
					>
						Вернуться на главную страницу
					</Button>
				</>
			) : (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Вы успешно изменили свой пароль
					</Typography>
					<div className={styles.verifyText}>
						<span>
							<b>С возвращением в аккаунт!</b> <br />
							Теперь вы можете использовать новые сведения для
							защиты аккаунта, чтобы войти в нее
						</span>
					</div>
					<Button
						type="submit"
						size="large"
						variant="contained"
						fullWidth
						onClick={() =>
							navigate('/account/login', {
								replace: true,
							})
						}
					>
						Готово
					</Button>
				</>
			)}
		</Paper>
	);
};

export default RecoveryPwd;
