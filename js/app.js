// 获取angula对象
angular.module('app', ['ngRoute'])
// 定义路由配置
.config(function ($routeProvider) {
	$routeProvider
	// 定义登录路由，
	.when('/login', {
		// 将login.html模板引入
		templateUrl: 'view/login.html',
		controller: 'loginCtrl'
	})
	// 定义一个根路由
	.when('/', {
		templateUrl: 'view/index.html',
		controller: 'homeCtrl'
	})
	// 配置用户模块路由，用户模块应该有三个路由，创建用户，用户详情，用户列表
	.when('/createuser', {
		templateUrl: 'view/user/create.html',
		controller: 'createUserCtrl'
	})
	.when('/userinfo/:userId', {
		templateUrl: 'view/user/info.html',
		controller: 'userInfoCtrl'
	})
	.when('/userlist/:pageNum', {
		templateUrl: 'view/user/list.html',
		controller: 'userListCtrl'
	})
	// 配置新闻模块的路由，新闻模块有三个路由，创建新闻，新闻详情，新闻列表
	.when('/createnews', {
		templateUrl: 'view/news/create.html',
		controller: 'createNewsCtrl'
	})
	.when('/newsinfo/:newsId', {
		templateUrl: 'view/news/info.html',
		controller: 'newsInfoCtrl'
	})
	.when('/newslist/:pageNum', {
		templateUrl: 'view/news/list.html',
		controller: 'newsListCtrl'
	})
	// 重定向
	.otherwise({
		redirectTo: '/'
	})
})
// 创建创建用户控制器
.controller('createUserCtrl', function ($scope, $http, $location) {
	// 设置性别默认值
	$scope.user = {
		sex: 'man'
	}
	// 提交
	$scope.submitData = function () {
		// 将$scope.user提交
		$http.post('action/createuser.php', $scope.user)
		.success(function (res) {
			// console.log(res)
			// 如果数据成功返回，我们跳转到列表页
			if (res && res.errno === 0) {
				$location.path('/userlist/1')
			}
		})
		// console.log($scope)
	}
})
// 创建用户详情控制器
.controller('userInfoCtrl', function ($scope, $routeParams, $http) {
	// 获取用户id
	$scope.userId = $routeParams.userId;
	// 根据用户id请求数据
	$http.get('action/userdetail.json', {
		params: {
			id: $scope.userId
		}
	})
	// 请求成功，我们将返回的数据保存在作用域中
	.success(function (res) {
		if (res && res.errno === 0) {
			$scope.data = res.data
		}
	})
})
// 定义用户列表控制器
.controller('userListCtrl', function ($scope, $routeParams, $http) {
	// 获取页码参数,保存在作用域中
	$scope.num = $routeParams.pageNum;
	// 根据pageNum请求数据
	$http.get('action/userlist.php?num=' + $scope.num)
	// 返回将数据保存在list中
	.success(function (res) {
		// 将数据保存下来
		if (res && res.errno === 0) {
			$scope.list = res.data;
		}
	})
})
// 创建创建新闻控制器
.controller('createNewsCtrl', function ($scope, $http, $location) {
	// 定义提交方法
	$scope.submitData = function () {
		// 提交数据 $scope.news
		$http.post("action/createnews.php", $scope.user)
		console.log($scope.user,0000000000)
		// 请求成功，跳转列表页面
		.success(function (res) {
			if (res && res.errno === 0) {
				// 跳转列表页
				$location.path('/newslist/1')
			}
		})
	}
})
// 创建新闻详情控制器
.controller('newsInfoCtrl', function ($scope, $routeParams, $http) {
	// 第一步获取新闻id
	$scope.newsId = $routeParams.newsId;
	// 第二步请求新闻数据
	$http.get('action/newsdetail.php', {
		params: {
			id : $scope.newsId
		}
	})
	// 第三步渲染数据
	.success(function (res) {
		if (res && res.errno === 0) {
			$scope.data = res.data;
		}
	})
})
// 创建新闻列表控制器
.controller('newsListCtrl', function ($scope, $routeParams, $http) {
	// 第一步获取页面
	$scope.num = $routeParams.pageNum;
	// 第二步请求数据
	$http.get('action/newslist.php?pageNum=' + $scope.num)
	// 第三步渲染数据
	.success(function (res) {
		if (res && res.errno === 0) {
			$scope.list = res.data;
		}
	})
})
// 定义导航控制器
.controller('navCtrl', function ($scope) {
	// 定义导航中的数据变量
	$scope.list = [
		{
			title: '用户模块',
			childList: [
				{
					title: '用户列表',
					// 对于用户列表，我们发送请求的时候，要携带请求的页面，
					link: '#/userlist/1'
				},
				{
					title: '创建用户',
					link: '#/createuser'
				}
			]
		},
		{
			title: '新闻模块',
			childList: [
				{
					title: '新闻列表',
					link: '#/newslist/1'
				},
				{
					title: '创建新闻',
					link: '#/createnews'
				}
			]
		}
	]
})
// 定义登录控制器
.controller('loginCtrl', function ($scope, $http, $location, $rootScope) {
	// 处理登录的业务逻辑
	$scope.submitData = function () {
		// 发送异步请求，提交数据（$scope.user）
		$http.post('action/login.php', $scope.user)
		// 监听返回
		.success(function (res) {
			if (res && res.errno === 0 && res.data) {
				// 登录成功返回用户名
				$rootScope.username = res.data.username;
				// 请求返回成功，跳转到首页
				$location.path('/')
			}
		})
	}
})
// 定义根控制器
// 封装检测登录服务
.factory('checkLogin', function ($http, $location, $rootScope) {
	// 返回的接口来检测
	return function () {
		// 发送请求，判断是否登录
		$http({
			url: 'action/checkLogin.php',
			method: 'GET'
		})
		// 请求成功时候的回调函数
		.success(function (res) {
			// 如果res中data存在username，我们就要显示这个页面
			// 否则显示登录页面（跳转login路由下）
			if (res.errno === 0 && res.data) {
				// 登录过
				// 如果返回用户名，我们要将他显示在页面中
				$rootScope.username = res.data.username
			} else {
				// 跳转到登录页面
				$location.path('/login')
			}
			$rootScope.isShow = 'block'
		})
	}
})
.controller('homeCtrl', function (checkLogin, $scope, $interval) {
	// 检测登录
	checkLogin();

	// 定义date
	$scope.date = new Date() 
	// 循环创建时间
	$interval(function () {
		$scope.date = new Date();
	}, 1000)

})
// 定义根作用域
.run(function (checkLogin) {
	checkLogin();
})