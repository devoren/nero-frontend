import React from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './ImageCropper.module.scss';
import { RotateLeft, RotateRight } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
interface IImageCropper {
	inputFile?: any;
	setInputFile?: React.Dispatch<React.SetStateAction<File | undefined>>;
	step?: number;
	nextStep?: () => void;
	image?: string;
	setImage?: React.Dispatch<React.SetStateAction<string>>;
	cropData?: string;
	setCropData?: React.Dispatch<React.SetStateAction<string>>;
	cropper?: Cropper | undefined;
	setCropper?: React.Dispatch<React.SetStateAction<Cropper | undefined>>;
	roundedCropper?: Cropper | undefined;
	setRoundedCropper?: React.Dispatch<
		React.SetStateAction<Cropper | undefined>
	>;
	handleClick: () => void;
	handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
	inputFileRef?: React.RefObject<HTMLInputElement>;
}

export const ImageCropper: React.FC<IImageCropper> = (props) => {
	const {
		image,
		cropData,
		cropper,
		setCropper,
		setRoundedCropper,
		inputFileRef,
		handleClick,
		handleChangeFile,
	} = props;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{props.step === 1 && (
				<>
					<Button
						onClick={handleClick}
						variant="outlined"
						size="large"
					>
						Выбрать файл
					</Button>

					<input
						ref={inputFileRef}
						type="file"
						onChange={handleChangeFile}
						hidden
						accept="image/*"
					/>
				</>
			)}
			{image && props.step === 2 && (
				<div style={{ width: '100%', position: 'relative' }}>
					<Cropper
						className={styles.mainCropper}
						preview=".img-preview"
						src={image}
						viewMode={3}
						aspectRatio={1}
						minCropBoxHeight={100}
						minCropBoxWidth={100}
						autoCropArea={0}
						checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
						onInitialized={(instance) => {
							setCropper!(instance);
						}}
						restore={false}
						guides={false}
						dragMode={'move'}
						draggable
						movable={false}
						toggleDragModeOnDblclick={false}
					/>
					<div className={styles.rotateImg}>
						<IconButton
							onClick={() => cropper?.rotate(-90)}
							disableRipple
							className={styles.iconButton}
						>
							<RotateLeft className={styles.rotateIcon} />
						</IconButton>
						<IconButton
							onClick={() => cropper?.rotate(90)}
							disableRipple
							className={styles.iconButton}
						>
							<RotateRight className={styles.rotateIcon} />
						</IconButton>
					</div>
				</div>
			)}
			{props.step === 3 && (
				<>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<Cropper
							className={styles.cropper}
							preview=".img-preview"
							src={cropData}
							viewMode={1}
							aspectRatio={1}
							minCropBoxHeight={100}
							minCropBoxWidth={100}
							// autoCropArea={0.1}
							checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
							onInitialized={(instance) => {
								setRoundedCropper!(instance);
							}}
							restore={false}
							guides={false}
							dragMode={'move'}
							background={false}
							movable={false}
							toggleDragModeOnDblclick={false}
							ready={(e) => {
								let el =
									e.currentTarget.parentElement &&
									(e.currentTarget.parentElement.children[1]
										.childNodes[2]
										.childNodes[0] as HTMLElement);
								if (el) {
									el.style.borderRadius = '50%';
								}
							}}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								marginLeft: '20px',
							}}
						>
							<div
								className="img-preview"
								style={{
									width: '100px',
									float: 'left',
									height: '100px',
									overflow: 'hidden',
									borderRadius: '50%',
								}}
							/>
							<div
								className="img-preview"
								style={{
									width: '50px',
									float: 'left',
									height: '50px',
									overflow: 'hidden',
									borderRadius: '50%',
									marginTop: '20px',
								}}
							/>
						</div>
					</div>
					<br style={{ clear: 'both' }} />
				</>
			)}
		</div>
	);
};

export default ImageCropper;
