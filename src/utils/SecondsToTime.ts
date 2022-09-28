const SecondsToTime = (e: number) => {
	const h = Math.floor(e / 3600)
			.toString()
			.padStart(2, '0'),
		m = Math.floor((e % 3600) / 60)
			.toString()
			.padStart(2, '0'),
		s = Math.floor(e % 60)
			.toString()
			.padStart(2, '0');
	if (e > 3600) {
		return `${h}:${m}:${s}`;
	}
	return `${m}:${s}`;
};

export default SecondsToTime;
