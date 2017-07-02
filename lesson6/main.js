var fibonacci = function(n) {
	if(typeof n !== 'number') {
		throw new Error('n should be a Number');
	}
	if(n < 0) {
		throw new Error('n should >= 0');
	}
	if(n > 10) {
		throw new Error('n should <= 10');
	}
	if(n === 0)
		return 0;
	if(n === 1)
		return 1;
	return arguments.callee(n-1) + arguments.callee(n-2);
}

if(require.main === module) {
	var n = Number(process.argv[2]);
	console.log('fibonacci(' + n + ') is', fibonacci(n));
}

exports.fibonacci = fibonacci;