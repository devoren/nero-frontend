interface Item {
	count: number;
	email: string;
	expiry: number;
}

const setWithExpiry = (
	key: string,
	count: number,
	email: string,
	ttl: number
) => {
	const now = new Date();
	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		count,
		email,
		expiry: now.getTime() + ttl * 1000,
	};
	localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key: string) => {
	const itemStr = localStorage.getItem(key);
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null;
	}
	const item: Item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key);
		return null;
	}
	return { count: item.count, email: item.email };
};

export { setWithExpiry, getWithExpiry };
