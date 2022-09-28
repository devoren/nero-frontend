import React from 'react';
import { Navigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TextField, Typography, Paper, Button, Avatar } from '@mui/material';

import { TF } from './components/TFconstants';
import { TextFields } from './components/TextFields';
import { useToken } from '../../../hooks/useToken';
import { SignUpRequest, VerifyRequest } from '../../../models';
import {
	useSignUpMutation,
	useVerifyMutation,
	useResendCodeMutation,
} from '../../../store/auth/auth.api';
import { useAppDispatch } from '../../../store/store';
import { setCredentials } from '../../../store/auth/auth.slice';
import { useUploadPhotoMutation } from '../../../store/post/post.api';
import SecondsToTime from '../../../utils/SecondsToTime';

import { ModalCropper } from './components';
import styles from './SignUp.module.scss';
import { getWithExpiry, setWithExpiry } from '../../../utils/localStorageTTL';

interface ICombine extends SignUpRequest, VerifyRequest {}

const SignUp = () => {
	const dispatch = useAppDispatch();

	const [signup] = useSignUpMutation();
	const [verify] = useVerifyMutation();
	const [resendCode] = useResendCodeMutation();
	const { token } = useToken();

	const {
		register,
		handleSubmit,
		setError,
		getValues,
		formState: { errors, isValid },
	} = useForm<ICombine>({
		defaultValues: {
			fullName: 'New User',
			email: 'test1@test.com',
			password: '12345',
		},
		mode: 'all',
	});
	const [uploadPhoto] = useUploadPhotoMutation();
	const [imageUrl, setImageUrl] = React.useState('');
	const [inputFile, setInputFile] = React.useState<File>();
	const [originalInputFile, setOriginalInputFile] = React.useState<File>();
	const [open, setOpen] = React.useState(false);
	const [step, setStep] = React.useState(1);
	const [isOtpSent, setIsOtpSent] = React.useState(false);
	const [isActive, setIsActive] = React.useState(false);
	const [seconds, setSeconds] = React.useState(60);
	const [count, setCount] = React.useState(
		getWithExpiry('signUpCount')?.count ?? 1
	);
	const timerRan = React.useRef(false);

	React.useEffect(() => {
		if (timerRan.current === true) {
			let interval: string | number | NodeJS.Timeout | undefined;

			if (isOtpSent) {
				interval = setInterval(() => {
					setSeconds((seconds) => seconds - 1);
				}, 1000);
			}

			if (!isOtpSent || seconds === 0) {
				clearInterval(interval);
			}

			return () => clearInterval(interval);
		}
		return () => (timerRan.current = true);
	}, [seconds, isOtpSent]);

	const onSubmit: SubmitHandler<SignUpRequest> = async (data) => {
		try {
			const formData = new FormData();
			inputFile && formData.append('image', inputFile);
			const formOData = new FormData();
			originalInputFile && formOData.append('image', originalInputFile);
			if (inputFile) {
				const response = await uploadPhoto(formData).unwrap();
				const responseO = await uploadPhoto(formOData).unwrap();
				data.avatarUrl = response.url;
				data.originalAvatarUrl = responseO.url;
			}
			const response = await signup(data).unwrap();
			console.log(response);
			URL.revokeObjectURL(imageUrl);
			setIsOtpSent(true);
			setIsActive(response.userData.active);
			// dispatch(
			// 	setCredentials({
			// 		user: response.userData,
			// 		accessToken: response.accessToken,
			// 	})
			// );
		} catch (err: any) {
			setError(
				'email',
				{
					type: 'shouldUnregister',
					message: 'Этот электронный адрес уже используется.',
				},
				{ shouldFocus: true }
			);
		}
	};

	const onVerify: SubmitHandler<VerifyRequest> = async (data) => {
		try {
			const { user, accessToken } = await verify(data).unwrap();
			console.log(user, accessToken);
			localStorage.removeItem('signUpCount');
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
		}
	};

	if (token) {
		return <Navigate to={'/'} />;
	}

	const handleOpen = () => {
		setStep(1);
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const prevStep = () => setStep(step - 1);
	const nextStep = () => setStep(step + 1);

	const email = getValues('email');
	const handleResendCode = async () => {
		getWithExpiry('signUpCount')?.email !== email &&
			getWithExpiry('signUpCount')?.count! < 5 &&
			localStorage.removeItem('signUpCount');

		if (count < 5) {
			await resendCode({
				email,
			})
				.unwrap()
				.then((res) => {
					res.message && setSeconds(60);
					setCount(count + 1);
					setWithExpiry('signUpCount', count, email, 5 * 60);
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

	return (
		<Paper classes={{ root: styles.root }}>
			{!isOtpSent && !isActive ? (
				<>
					<Typography classes={{ root: styles.title }} variant="h5">
						Создание аккаунта
					</Typography>
					<div className={styles.avatar}>
						<Button
							onClick={handleOpen}
							disableRipple
							className={styles.avatarButton}
						>
							<Avatar
								sx={{ width: 100, height: 100 }}
								src={imageUrl ?? '/public/noavatar.png'}
							/>
						</Button>
					</div>
					<ModalCropper
						step={step}
						setStep={setStep}
						open={open}
						handleClose={handleClose}
						prevStep={prevStep}
						nextStep={nextStep}
						inputFile={inputFile}
						setInputFile={setInputFile}
						setOriginalInputFile={setOriginalInputFile}
						setImageUrl={setImageUrl}
					/>
					<form onSubmit={handleSubmit(onSubmit)}>
						{TF.map((tf) => (
							<TextFields
								key={tf.type}
								type={tf.type}
								className={styles.field}
								label={tf.label}
								error={errors[tf.error as keyof typeof errors]}
								helperText={
									errors[tf.helperText as keyof typeof errors]
								}
								useForm={register}
								options={{
									title: tf.options.title,
									required: tf.options.required,
									pattern: tf.options.pattern,
									minLength: tf.options.minLength,
								}}
							/>
						))}
						<Button
							type="submit"
							size="large"
							variant="contained"
							fullWidth
							disabled={!isValid}
						>
							Зарегистрироваться
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
							disabled={count > 4}
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

export default SignUp;
