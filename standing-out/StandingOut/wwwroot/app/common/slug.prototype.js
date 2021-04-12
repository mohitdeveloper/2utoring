if (!String.prototype.slug) {
	String.prototype.slug = function () {
		return this.toLowerCase()
                   .replace(/[^\w ]+/g, '')
                   .replace(/ +/g, '-');
	};
}