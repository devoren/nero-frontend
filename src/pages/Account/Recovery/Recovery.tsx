import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography, Paper, Button } from '@mui/material';

import { RecoveryRequest } from '../../../models';
import { useRecoveryMutation } from '../../../store/auth/auth.api';

import styles from './Recovery.module.scss';

const Recovery = () => {
	const navigate = useNavigate();
	const [recovery] = useRecoveryMutation();
	const [isActive, setIsActive] = React.useState(false);

	const {
		register,
		handleSubmit,
		setError,
		getValues,
		formState: { errors, isValid },
	} = useForm<RecoveryRequest>({
		defaultValues: {
			email: 'test@test.com',
		},
		mode: 'all',
	});
	const email = getValues('email');
	const onSubmit: SubmitHandler<RecoveryRequest> = async (data) => {
		try {
			const { message } = await recovery(data).unwrap();
			setIsActive(true);
			console.log(message);
		} catch (err) {
			setError(
				'email',
				{
					type: 'value',
					message: 'Неверный адрес электронной почты',
				},
				{ shouldFocus: true }
			);
			console.log(err);
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
						<span>Восстановление аккаунта Nero</span>
					</div>
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
						<Button
							type="submit"
							size="large"
							variant="contained"
							disabled={!isValid}
							fullWidth
						>
							Далее
						</Button>
					</form>
				</>
			) : (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Восстановите пароль вашего аккаунта
					</Typography>
					<div className={styles.verifyText}>
						<span>
							Ссылка для восстановления пароля отправлена на{' '}
							<b>{email}</b>. Если вы его не видите, проверьте
							папку со спамом
						</span>
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
			)}
		</Paper>
	);
};

export default Recovery;
