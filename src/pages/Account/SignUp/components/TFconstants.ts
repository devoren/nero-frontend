export const TF = [
	{
		label: 'Полное имя',
		error: 'fullName',
		helperText: 'fullName',
		type: 'text',
		options: {
			title: 'fullName',
			required: 'Укажите полное имя',
			pattern: {
				value: '',
				message: '',
			},
			minLength: {
				value: 8,
				message: '',
			},
		},
	},
	{
		label: 'E-Mail',
		error: 'email',
		helperText: 'email',
		type: 'email',
		options: {
			title: 'email',
			required: 'Укажите почту',
			pattern: {
				value: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
				message: 'Неверный формат почты',
			},
			minLength: {
				value: 8,
				message: '',
			},
		},
	},
	{
		label: 'Пароль',
		error: 'password',
		helperText: 'password',
		type: 'password',
		options: {
			title: 'password',
			required: 'Укажите пароль',
			pattern: {
				value: '',
				message: '',
			},
			minLength: {
				value: 8,
				message: 'Пароль должен быть минимум 8 символов',
			},
		},
	},
];
