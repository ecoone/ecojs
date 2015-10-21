mniya.define("module2", ["module3"], function(module3) {
	console.log("module2")
	return {
		sayHello: function() {
			alert("hello,module2");
			module3.sayHello();
		}
	}
});
