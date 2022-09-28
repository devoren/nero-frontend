import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useToken } from '../../hooks/useToken';

import { useLogoutMutation } from '../../store/auth/auth.api';
import { persistor, useAppDispatch } from '../../store/store';
import { logOut } from '../../store/auth/auth.slice';

const Header = () => {
	const dispatch = useAppDispatch();
	const { token } = useToken();
	const [logout] = useLogoutMutation();

	const onClickLogout = async () => {
		try {
			await logout();
			dispatch(logOut());
			persistor.purge();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.mobile}>
					{token ? (
						<Link to={`/add-post`} className={styles.addPost}>
							<IconButton color="primary">
								<EditIcon />
							</IconButton>
						</Link>
					) : (
						<Link to="/account/register">
							<IconButton color="primary">
								<AccountCircleIcon />
							</IconButton>
						</Link>
					)}
					<Link className={styles.logo} to="/">
						<span>NERO</span>
					</Link>
					{token ? (
						<IconButton color="primary" onClick={onClickLogout}>
							<LogoutIcon />
						</IconButton>
					) : (
						<Link to="/account/login">
							<IconButton color="primary">
								<LoginIcon />
							</IconButton>
						</Link>
					)}
				</div>
				<div className={styles.screen}>
					<Link className={styles.logo} to="/">
						<span>NERO</span>
					</Link>
					<div className={styles.buttons}>
						{token ? (
							<>
								<Link to="/add-post">
									<Button variant="contained">
										Написать статью
									</Button>
								</Link>
								<Button
									onClick={onClickLogout}
									variant="contained"
									color="error"
								>
									Выйти
								</Button>
							</>
						) : (
							<>
								<Link to="/account/login">
									<Button variant="outlined">Войти</Button>
								</Link>
								<Link to="/account/register">
									<Button variant="contained">
										Создать аккаунт
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Header;
