import React, { memo, useRef, useState } from "react";
import ImageCropper from "../../../../components/ImageCropper";
import Modal from "../../../../components/Modal";

import "cropperjs/dist/cropper.css";

interface IModalCropper {
	step: number;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	open: boolean;
	handleClose: () => void;
	prevStep: () => void;
	nextStep: () => void;
	inputFile: any;
	setInputFile: React.Dispatch<React.SetStateAction<File | undefined>>;
	setOriginalInputFile: React.Dispatch<
		React.SetStateAction<File | undefined>
	>;
	setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ModalCropper: React.FC<IModalCropper> = (props) => {
	const [image, setImage] = useState("");
	const [cropData, setCropData] = useState("#");
	const [cropper, setCropper] = useState<Cropper>();
	const [roundedCropper, setRoundedCropper] = useState<Cropper>();
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState("");
	const getCropData = () => {
		if (typeof cropper !== "undefined") {
			cropper.getCroppedCanvas().toBlob(
				(blob) => {
					const url = blob && URL.createObjectURL(blob);
					url && setCropData(url);
					const file =
						blob &&
						new File([blob], fileName, {
							type: "image/jpg",
						});
					file && props.setOriginalInputFile(file);
				},
				"image/jpg",
				1
			);
		}
	};

	const getRoundedCropData = () => {
		if (typeof roundedCropper !== "undefined") {
			roundedCropper.getCroppedCanvas().toBlob(
				(blob) => {
					const url = URL.createObjectURL(blob!);
					url && props.setImageUrl(url);
					url && setCropData(url);
					const file =
						blob &&
						new File([blob], fileName, {
							type: "image/jpg",
						});
					file && props.setInputFile(file);
					props.handleClose();
				},
				"image/jpg",
				1
			);
		}
	};

	const handleClick = () => {
		inputFileRef.current && inputFileRef.current.click();
	};

	const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		file && setImage && setImage(URL.createObjectURL(file));
		file && props.nextStep && props.nextStep();
		file && setFileName(file?.name);
	};

	return (
		<Modal
			open={props.open}
			handleClose={props.handleClose}
			title={
				props.step === 1
					? "Загрузка новой фотографии"
					: props.step === 2
					? "Фотография на вашем аккаунте"
					: props.step === 3
					? "Выбор миниатюры"
					: ""
			}
			desc_1={
				props.step === 1
					? "Друзьям будет проще узнать вас, если вы загрузите свою настоящую фотографию."
					: props.step === 2
					? "Выбранная область будет показываться на вашем аккаунте."
					: props.step === 3
					? "Выберите область для маленьких фотографий."
					: ""
			}
			desc_2={
				props.step === 1
					? "Вы можете загрузить изображение в формате JPG, GIF или PNG."
					: props.step === 2
					? "Если изображение ориентировано неправильно, фотографию можно повернуть."
					: props.step === 3
					? "Выбранная миниатюра будет использоваться в новостях, личных сообщениях и комментариях."
					: ""
			}
			bottomText={
				props.step === 1
					? "Если у вас возникают проблемы с загрузкой, попробуйте выбрать фотографию меньшего размера."
					: ""
			}
			backButton={
				props.step === 2
					? () => {
							props.prevStep();
							props.setInputFile(undefined);
							props.setOriginalInputFile(undefined);
							setImage("");
					  }
					: props.prevStep
			}
			backButtonTitle={"Вернуться назад"}
			nextButton={
				props.step === 2
					? () => {
							getCropData();
							props.nextStep();
					  }
					: async () => {
							getRoundedCropData();
					  }
			}
			nextButtonTitle={"Сохранить и продолжить"}
		>
			<ImageCropper
				step={props.step}
				image={image}
				cropData={cropData}
				cropper={cropper}
				setCropper={setCropper}
				roundedCropper={roundedCropper}
				setRoundedCropper={setRoundedCropper}
				inputFileRef={inputFileRef}
				handleClick={handleClick}
				handleChangeFile={handleChangeFile}
			/>
		</Modal>
	);
};
export default memo(ModalCropper);
