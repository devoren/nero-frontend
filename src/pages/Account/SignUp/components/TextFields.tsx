import React from 'react';
import { TextField } from '@mui/material';

interface ITextField {
	className: any;
	label: string;
	type: string;
	error: any;
	helperText: any;
	useForm: any;
	options: {
		title: string;
		required: string;
		pattern?: {
			value: RegExp | string;
			message: string;
		};
		minLength?: {
			value: number;
			message: string;
		};
	};
}

export const TextFields: React.FC<ITextField> = (props) => {
	return (
		<TextField
			type={props.type}
			className={props.className}
			label={props.label}
			fullWidth
			error={Boolean(props.error?.message)}
			helperText={props.error?.message}
			{...props.useForm(props.options.title, {
				required: props.options.required,
				pattern: props.options.pattern,
				minLength: props.options.minLength,
			})}
		/>
	);
};
