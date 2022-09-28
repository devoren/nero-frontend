import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Backdrop, CircularProgress } from '@mui/material';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {
	useAddPostMutation,
	useGetPostQuery,
	useUpdatePostMutation,
	useUploadPhotoMutation,
} from '../../store/post/post.api';

const AddPost = () => {
	const { id } = useParams();
	const { data: post, isFetching } = useGetPostQuery(id!, { skip: !id });
	const navigate = useNavigate();
	const [uploadPhoto] = useUploadPhotoMutation();
	const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
	const [addPost, { isLoading: isAdding }] = useAddPostMutation();

	const [title, setTitle] = React.useState('');
	const [tags, setTags] = React.useState('');
	const [text, setText] = React.useState('');
	const [imageUrl, setImageUrl] = React.useState('');
	const inputFileRef = useRef(null);
	const isEditing = Boolean(id && post);

	const handleChangeFile = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		try {
			const formData = new FormData();
			const file = event.target.files && event.target.files[0];
			formData.append('image', file!);
			const response = await uploadPhoto(formData).unwrap();
			setImageUrl(response.url);
		} catch (err) {
			console.log(err);
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = React.useCallback((value: string) => {
		setText(value);
	}, []);

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setText(post.text);
			setTags(post.tags.join(', '));
			setImageUrl(post.imageUrl!);
		}
	}, [post]);

	const onSubmit = async () => {
		try {
			const fields = {
				title,
				imageUrl,
				tags: tags.split(',').map((tag) => tag.trim()),
				text,
			};

			const viewsCount = post?.viewsCount ?? 0;

			const response = isEditing
				? await updatePost({ _id: id, ...fields, viewsCount }).unwrap()
				: await addPost(fields).unwrap();
			const _id = isEditing ? id : response._id;

			navigate(`/posts/${_id!}`, { replace: true });
		} catch (err) {
			console.log(err);
		}
	};

	const options: EasyMDE.Options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				uniqueId: 'mde-autosave',
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	return (
		<>
			<Backdrop
				sx={{
					color: '#4361ee',
					backgroundColor: 'white',
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={isEditing && (isFetching || isUpdating || isAdding)}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Paper sx={{ padding: { sm: '30px', xs: '15px' } }}>
				<Button
					onClick={() => (inputFileRef.current as any).click()}
					variant="outlined"
					size="large"
				>
					Загрузить превью
				</Button>
				<input
					ref={inputFileRef}
					type="file"
					onChange={handleChangeFile}
					hidden
				/>
				{imageUrl && (
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
						style={{ marginLeft: '5px' }}
					>
						Удалить
					</Button>
				)}
				{imageUrl && (
					<img
						className={styles.image}
						src={`http://localhost:8000${imageUrl}`}
						alt="Uploaded"
					/>
				)}
				<br />
				<br />
				<TextField
					classes={{ root: styles.title }}
					variant="standard"
					placeholder="Заголовок статьи..."
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<TextField
					classes={{ root: styles.tags }}
					variant="standard"
					placeholder="Тэги"
					fullWidth
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>
				<SimpleMDE
					className={styles.editor}
					value={text}
					onChange={onChange}
					options={options}
				/>
				<div className={styles.buttons}>
					<Button onClick={onSubmit} size="large" variant="contained">
						{isEditing ? 'Сохранить' : 'Опубликовать'}
					</Button>
					<Link to="/">
						<Button size="large">Отмена</Button>
					</Link>
				</div>
			</Paper>
		</>
	);
};

export default AddPost;
