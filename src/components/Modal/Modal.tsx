import React from 'react';

import Dialog from '@mui/material/Dialog';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { Close } from '@mui/icons-material';

import styles from './Modal.module.scss';

export interface DialogTitleProps {
	id: string;
	children?: React.ReactNode;
	onClose: () => void;
}

const ModalTitle = (props: DialogTitleProps) => {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2, fontSize: '14px' }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<Close />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

interface IModal {
	open: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	handleClose: () => void;
	children: React.ReactNode;
	title: string;
	desc_1: string;
	desc_2?: string;
	backButton?: () => void;
	backButtonTitle?: string;
	nextButton?: () => void;
	nextButtonTitle?: string;
	bottomText?: string;
}

const Modal: React.FC<IModal> = (props) => {
	return (
		<Dialog
			open={props.open}
			// onClose={props.handleClose}
			aria-labelledby="keep-mounted-modal-title"
			aria-describedby="keep-mounted-modal-description"
			scroll="body"
		>
			<ModalTitle id="customized-modal-title" onClose={props.handleClose}>
				{props.title}
			</ModalTitle>
			<Divider />
			<DialogContent style={{ paddingBottom: '12px' }}>
				<div className={styles.modal_desc}>
					{props.desc_1}
					<br />
					{props.desc_2 ? props.desc_2 : ''}
				</div>
				{props.children}

				<Divider
					style={{
						paddingTop: '20px',
						width: '100%',
					}}
				/>
				<DialogActions
					style={{
						position: 'relative',
						justifyContent: 'center',
						paddingBottom: 0,
						paddingTop: '8px',
					}}
				>
					{props.bottomText ? (
						<p style={{ textAlign: 'center', fontSize: '12px' }}>
							{props.bottomText}
						</p>
					) : (
						<>
							<Button
								onClick={props.nextButton}
								variant="contained"
							>
								{props.nextButtonTitle}
							</Button>
							<Button
								onClick={props.backButton}
								variant="outlined"
							>
								{props.backButtonTitle}
							</Button>
						</>
					)}
				</DialogActions>
			</DialogContent>
			{/* <Divider />
				<DialogActions
					style={{ justifyContent: 'center'}}
				>
					{props.bottomText ? (
						<p style={{ textAlign: 'center', fontSize: '14px' }}>
							{props.bottomText}
						</p>
					) : (
						<>
							<Button
								onClick={props.nextButton}
								variant="contained"
							>
								{props.nextButtonTitle}
							</Button>
							<Button
								onClick={props.backButton}
								variant="outlined"
							>
								{props.backButtonTitle}
							</Button>
						</>
					)}
				</DialogActions> */}
		</Dialog>
	);
};

export default Modal;
