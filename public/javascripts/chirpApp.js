var app = angular.module('chirpApp', ['ngRoute','ngResource']).run(function($rootScope){
 	$rootScope.authenticated = false;
 	$rootScope.currenUser = ''

 	$rootScope.signout = function(){
 		$http.get('/authenticate/signout');
 		$rootScope.authenticated = false;
 		$rootScope.currenUser = ''

 	}
});


app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

app.factory('postService',function($resource){
	return $resource('api/posts/:id');
})

app.controller('mainController', function($rootScope,$scope ,postService){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	/*postService.getAll().success(function(data){
		$scope.posts = data;
	})
*/
	$scope.post = function(){
		/*$scope.newPost.created_at = Date.now();
		$scope.posts.push($scope.newPost);
		$scope.newPost = {created_by: '', text: '', created_at: ''};*/
		$scope.newPost.created_by = $rootScope.currenUser;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost,function(){
			$scope.newPost = {created_by: '', text: '', created_at: ''};
			$scope.posts = postService.query();
		})
	};
});

app.controller('authController', function($scope,$rootScope,$location,$http){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('authenticate/login',$scope.user).success(function(data){
			$rootScope.authenticated = true;
			$rootScope.currenUser = data.user.username;
			$location.path('/');
		})
	};

	$scope.register = function(){
			$http.post('authenticate/signup',$scope.user).success(function(data){
			$rootScope.authenticated = true;
			$rootScope.currenUser = data.user.username;
			$location.path('/');
		})
	};
});