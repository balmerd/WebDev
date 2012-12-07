//
// add extensions here
//
String.prototype.isEmpty = function () {
	return ($.trim(this).length <= 0);
};
String.prototype.isNotEmpty = function () {
	return (this.isEmpty() === false);
};
