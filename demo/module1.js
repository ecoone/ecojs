mniya.define("module1", ["module2","module3"], function(module2,module3) {
	console.log("module1")
	return {
		sayHello: function() {
			alert("hello,module1");
			module2.sayHello();
			module3.sayHello();
		}
	}
});
