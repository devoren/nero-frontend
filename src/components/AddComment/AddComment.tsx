import React, { useState } from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useAddCommentMutation } from '../../store/post/post.api';
import { useAuth } from '../../hooks/useAuth';

interface IComment {
	postId?: string;
	refetch: () => void;
}

const AddComment = ({ postId, refetch }: IComment) => {
	const [text, setText] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	const [addComment] = useAddCommentMutation();
	const addCommentHandler = async () => {
		try {
			setIsDisabled(true);
			const body = {
				text,
				postId,
			};
			const response = await addComment(body).unwrap();
			refetch();
			response && setIsDisabled(false);
			setText('');
		} catch (err) {
			setIsDisabled(false);
			console.log(err);
		}
	};
	const { user } = useAuth();

	return (
		<>
			<div className={styles.root}>
				<Avatar
					classes={{ root: styles.avatar }}
					src={user?.avatarUrl ?? '/noavatar.png'}
				/>
				<div className={styles.form}>
					<TextField
						label="Написать комментарий"
						variant="outlined"
						maxRows={10}
						multiline
						fullWidth
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button
						variant="contained"
						onClick={addCommentHandler}
						disabled={isDisabled || !text.length}
					>
						Отправить
					</Button>
				</div>
			</div>
		</>
	);
};
export default AddComment;
