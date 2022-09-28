import React from 'react';
import { IUser } from '../../models';
import styles from './UserInfo.module.scss';

const UserInfo = ({ avatarUrl, fullName, updatedAt }: Partial<IUser>) => {
	return (
		<div className={styles.root}>
			<img
				className={styles.avatar}
				src={avatarUrl || '/noavatar.png'}
				alt={fullName}
			/>
			<div className={styles.userDetails}>
				<span className={styles.userName}>{fullName}</span>
				<span className={styles.additional}>
					{new Date(updatedAt!).toLocaleString()}
				</span>
			</div>
		</div>
	);
};

export default UserInfo;
