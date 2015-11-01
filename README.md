#eco.js生态框架

eco框架是一个依赖于命名空间的生态框架。为何称为生态框架，在于他服务于前端开发的各个层次,包括框架、库、组件、系统架构、业务代码开发、工程化等各个层面的。主要由下面几块组成:命名空间、模块机制、任务服务模型的业务工作流、AOP切面。

##eco.js能做什么？
1. 有命名空间的模块加载
2. 写框架
3. 写组件
4. 搭建系统架构 
5. 业务代码工程化
6. aop切面编程
7. ...更多....


##命名空间

命名空间是在全局空间只占用一个名字的资源系统，这个名字是命名空间名，所有资源都在命名空间名上。我们可以用命名空间，来描述系统、框架、库等，这样他们之间就不会相互干扰，只要命名空间名不冲突就好。由命名空间构建的资源集合就被称为生态圈，只是生态圈的大小不一样而已。

命名空间是我们生态框架的基础。所有的功能都在命名空间上，当你创建了一个命名空间后，你就有了命名空间的所有功能，你就可以用这些功能创建生态圈资源。

命名空间还是继承特性，一个命名空间可以生成的子命名空间，可以获得父命名空间的模块，如果子命名空间和父命名空间有同样模块名的模块那么就获取子命名空间模块，这种机制类似于原型链。eco就是我们整个系统中的根命名空间，他是所有其他命名空间的祖先。

###命名空间定义
命名空间定义的函数是：`namespace (name, callback)`。

**name**：是命名空间的名字，当已经存在这个命名空间的话，直接返回就可以

**callback**:是命名空间定义完运行的一个回掉函数

例子

	eco.namespace("mniya");   //这样mniya就是eco的子命名空间了

###命名空间的带环境变量的数据存储
数据存储函数:`data (keyAndEnv, data)`
keyAndEnv：数据的key，或者数据的key.env
data：key对应的数据

数据的环境变量配置:`env (envAndKey)`
envAndKey:环境变量或者某个key的环境变量，全局环境变量的优先级小于属于某个key的环境变量

例子

	mniya.data(“api”,{
	  base:”http://www.mniya.com",
	});
	mniya.data("api”).base;  // http://www.mniya.com
	
	mniya.data(“api.dev”,{
	 base:”http://127.0.0.1”
	});
	mniya.data(“api.prd”,{
	 base:”http://www.mniya.com”
	});
	
	mniya.data(“api.dev”).base; //http://127.0.0.1
	mniya.data("api”).base;  // http://www.mniya.com
	
	mniya.env("prd");
	mniya.data(“api").base;//http://www.mniya.com
	
	mniya.env(“api.dev”); 
	mniya.data(“api.dev”).base; //http://127.0.0.1
	mniya.data("api”).base;  //http://127.0.0.1
	
	
###命名空间的元数据定义

命名空间元数据定义的函数是：`meta (metaData)`。

metaData的结构是
		
	 {
		name: "",          //名称
		version: "",       //版本号
		description: "",   //描述
		author: "",        //作者
		participator: ""   //参与者
	}
当然也可以自己添加更多数据

###命名空间的工具类

命名空间的工具类是：util属性。包含的功能有类型判断、request请求js和css资源、事件机制、对象扩展extend功能。


##模块

###模块定义

生态框架中模块的定义的规则类似与AMD规范。不支持CMD中的require，因为模块写在前面更清晰。

什么时候使用模块呢？当有按需加载需求的时候才要使用模块。这里是有这个需求，但不一定非要按需加载。

模块定义函数：`define (id, dependencyIds, factory)`是一个属于属于namespace的原型方法，只要是命名空间皆可以使用这个方法。这个方法也可以接受两个参数，这个时候第一个参数是id，第二个参数是factory

**id**：模块的标识必填

**dependencyIds**：模块的依赖，这里支持命名空间继承依赖。虽然也可以跨命名空间系统依赖，但是作为一个命名空间体系里面最好不要去跨命名空间依赖，只有在use模块的时候可以去加载多个命名空间系统的模块。跨域的依赖需要在模块名字前面加上命名空间的名字，并用点连接。

**factory**:为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。如果不是函数那么他就同步的模块使用方法，直接将模块名暴露给命名空间名。

例子：

	eco.define("ecoModule1", ['ecoModule2'], function(ecoModule2) {
		console.log("ecoModule1");
		return {
			sayHello: function() {
				alert("hello,ecoModule1");
				ecoModule2.sayHello();
			}
		}
	});
	eco.define("ecoModule2", function() {
		console.log("ecoModule2")
		return {
			sayHello: function() {
				alert("hello,ecoModule2");
			}
		}
	});


###模块的资源配置

资源配置，配置的资源包括2类，一类是模块文件，一类是命名空间文件或者命名空间配置文件。

资源配置函数：`config (configData)`,configData为配置数据，configData对象结构如下：

	{
	    base: "/", 
	    nameSpaces: {}, 
	    fullNameSpaces: {},
	    modules: {},
	    fullModules: {}
	}

**base**: 所有资源的基础路径

**nameSpaces**:需要加载命名空间资源，以命名空间名为key，以资源地址为value，完整地址由base和value拼接而成

**fullNameSpaces**:需要加载命名空间资源，以命名空间名为key，以资源地址为value，这里的value就是完整地址不需要拼接
	
**modules**:需要加载模块资源，以命名空间名为key，以资源地址为value，完整地址由base和value拼接而成

**fullModules**:需要加载模块资源，以命名空间名为key，以资源地址为value，这里的value就是完整地址不需要拼接	

例子：

	//file1 ecoConfig.js
	eco.config({ 
		base:"http://127.0.0.1:3000/ecojs/src/",
		nameSpaces:{
			"mniya":"mniyaConfig.js",
		}
	})
	
	//file2 mniyaConfig.js
	eco.namespace("mniya");
	mniya.config({
		base:"http://127.0.0.1:3000/ecojs/src/",
		modules:{
			"module1":"module1.js",
			"module2":"module2.js",
			"module1Style":"module1Style.css"
		}
	});

###模块加载使用

模块使用有两种方式，第一种，我们已经知道所有模块资源已经全部加载了，我们启用同步模块使用方式。还有一种是所需模块没有加载或者部分加载的异步模块加载方式。

模块加载使用函数：`use (nameSpaceNames, dependencyIds, factory)`是一个属于属于namespace的原型方法，只要是命名空间皆可以使用这个方法。

**nameSpaceNames**：需要加载的未加载命名空间。参数类型支持数组和字符串两种形式，当为字符串的时候，是只有一个命名空间。如果第二个参数中通过带命名空间名引入模块了，命名空间名会自动进入这个参数里面，不需要在放在显式写出。

**dependencyIds**：需要加载的模块，参数类型支持数组和字符串两种形式，这里支持命名空间继承依赖和跨命名空间系统依赖。跨命名空间系统的依赖需要在模块名字前面加上命名空间的名字，并用点连接。

**factory**：业务代码，有加载的每个模块做参数。

下面是use两种使用方式：

1. 同步模块使用   
当页面中所有模块及其依赖资源都加载好的时候，你可以按照同步方式使用use，use函数只有一个dependencyIds参数。并以模块名为属性暴露在命名空间上。

2. 异步模块使用
这个时候use函数，有两个参数或者三个参数，区别是有一个不需要加载命名空间的资源配置文件了，即省了nameSpaceNames参数。

另外需要注意的是，只要在资源配置表里面配置了，我们就可以用他来加载css，这个时候会创建一个没有依赖的模块。

例子

	//展示跨命名空间调用
	eco.use(['mniya'],["ecoModule1","mniya.module1"],function(ecoModule1,module1){
		ecoModule1.sayHello();
		module1.sayHello();
	});
	//展示省略命名空间的的调用，mniya.module1会自动去加载minya的配置文件
	eco.use(["ecoModule1","mniya.module1"],function(ecoModule1,module1){
		ecoModule1.sayHello();
		module1.sayHello();
	});
	//展示继承省略命名空间名的形式，ecoModule1属于eco是mniya的父命名空间
	mniya.use(['mniya'],["ecoModule1","module1"],function(ecoModule1,module1){
		ecoModule1.sayHello();
		module1.sayHello();
	});

###模块是否可用

提供了三个函数,属于模块对象的。

1. **isEnable** 模块是否可用
2. **enable**   模块不可用
3. **disable**  模块不可用

##命名空间和模块相关信息控制台展示函数

这些函数不是为了编码使用的，只是为了查看一些数据信息

1. `namespace.showNameSpaceTree` 展示这个命名空间的子命名空间继承树
2. `namespace.showModules`       展示这个命名空间下的所有模块 
3. `namespace.showModulesTree`   展示这个命名空间下所有模块的依赖树
4. `namespace.showModuleTree(moduleId)` 获取模块依赖树

##任务服务模型的业务工作流

###任务
是我们业务中要完成的一件事件比如说初始化渲染页面、事件绑定、提交订单处理等。任务中可以使用服务和调用子任务

###服务
服务由任务调用也可以由其他服务调用。调用者提供参数，服务提供输出。

###工作流
其实就是一个任务序列的定义和执行。

下面给出一个例子

方式1：

	   eco.task("render",function(service){
	       console.log("render");
	   });
	
	   eco.task("bindEvent",function(service,task){
	    console.log("bindEvent");
	    service.service1();
	    task.submitOrder();
	   });
	   eco.task("submitOrder",function(service){
	        console.log("submitOrder");
	   })
	   eco.service("service1",function(){
	           console.log("service1");
	           this.service2();
	    });
	    eco.service("service2",function(){
	      console.log("service2");
	    });  
	   eco.workflow("indexPage",["render","bindEvent"]).run(); //运行工作流的第一种形式

方式2 :

	    eco.service({
	      service1:function(){
	        console.log("service1");
	        this.service2();
	      },
	      service2:function(){
	        console.log("service2");
	      }
	    });
	    eco.task({
	        render:function(){
	          console.log("render");
	        },
	        bindEvent:function(service,task){
	          console.log("bindEvent");
	          service.service1();
	          task.submitOrder();
	        },
	        submitOrder:function(){
	        console.log("submitOrder");
	        }
	    });  
	   eco.workflow(["render","bindEvent"]).run(); //运行工作流的第一种形式

##AOP切面
AOP(Aspect Oriented Programming)面向切面编程，是一种编程范式，提供从另一个角度来考虑程序结构以完善面向对象编程（OOP），AOP为开发者提供了一种描述横切关注点的机制，并能够自动将横切关注点织入到面向对象的软件系统中，从而实现了横切关注点的模块化。我们已经从ecojs的切面模块发展出了aspectjs切面组件，以后这个功能会在两个项目中保持同步。

###切面
切面定义：`new namespace.Aspect(aspectId,advice)`。

**aspectId**:切面的名称，必填。

**advice**:通知，选填。

例子：

	var statTimesFilter = new Aspect("statTimesFilter");

###通知
我们的通知有下面几种类型：before,after,throwing,around,[eventName]。eventName可以是任何事件名.通知可以在切面定义的时候传入，也可以以后定义。

通知定义：`[aspectName].advice.[adviceName] = function(jointPoint)`。
**jointPoint**:这个连接点的数据对象。结构如下：

	{
	  context: context,  //目标对象
	  contextName: Aspect.getClassName(context), //目标对象名字
	  target: originTarget,  //切面针对的函数，在未加切面原来的样子
	  targetName: targetName,//函数名字
	  arguments: arguments,//函数参数
	  result: "",          //函数返回的数据
	  error: "",           //针对异常切面，返回的异常数据
	  stop: false,         //用于阻断函数执行
	  eventDatas: {}	   //key是某个特定事件切面的名称，value是事件传送的数据
	}
	
例子：

	statTimesFilter.advice.before = function(jointPoint){
		var context = jointPoint.context;
		var contextName = jointPoint.contextName;
		var target = jointPoint.target;
		var targetName = jointPoint.targetName;
	    var arguments = jointPoint.arguments;
		this.startTime = new Date();
		this.escape = 0;
		console.log("统计开始时间："+this.startTime);
		//用于控制代码是否停止
		// jointPoint.stop = true;
		jointPoint.arguments[0] ="change";
	}


###连接点

切入点是一组连接点，用于连接目标对象和切面的。

切入点定义：`pointCut(context,targetNames)`。

**context**:目标对象。

**targetNames**:目标对象上要被加上切面的方法名。类型是array或者string

参数可以是1个，也可以是两个。参数为1个的时候，且类型为array或者string，这个参数就是targetNames。如果是object，那么就是context，这个时候的targetNames为这个context上的所有方法。

例子：

	var testObj ={
		f1:function(arg1){
			console.log(arg1)
			console.log("f1");
			if(this._eventAdvices&&this._eventAdvices["f1"]){ //这里是针对事件切面的
				var eventAdvice  = this._eventAdvices["f1"];
				var eventData = {aa:"111"};
				eventAdvice.emit("eventName",eventData);
			}
		}
	}
	statTimesFilter.pointCut(testObj,"f1");
	statTimesFilter.pointCut(testObj,"f1");
	testObj.f1("入参1");


