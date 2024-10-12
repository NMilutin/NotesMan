export const getDaysInMonth = function (
	m = new Date().getMonth() + 1,
	y = new Date().getFullYear()
) {
	return new Date(y, m, 0).getDate();
};
