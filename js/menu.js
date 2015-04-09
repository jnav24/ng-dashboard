/*
	Looks like I dont need totalPages
	the publish and draft buttons do not filter through all pages
	when you make a change in the input field then delete it, it doesnt revert the page number back.
		filtered reads it as 10 rather than 15
*/

angular.module('jnCMS',['ngCookies','ngRoute','ui.bootstrap','ngSanitize','xeditable','textAngular'])

.controller('jncms', function($scope,$http,$location) {
	$scope.getMenu = function() {
		return $location.url().split('/')[1].substring(0,1).toUpperCase() + $location.url().split('/')[1].substring(1);
	}

	$http.get('json/menu.json').success(function(data) {
		$scope.menus = data;
	});
})

.controller('jnposts', function($scope,$http,$routeParams,$sce,$timeout,$location,$anchorScroll,Posts) {

	$scope.testInit = function(blah) {
		// alert(blah);
	}

	$scope.curPost = function() {
		return $location.url();
	}

	$http.get('json/categories.json').success(function(data) {
		$scope.categories = data;
	});

	$http.get('json/syntaxHighlight.json').success(function(data) {
		$scope.syntaxHighlight = data;
	});

	$http.get('json/posts.json').success(function(data) {
		$scope.posts = data;
		$scope.singlePost = $scope.posts[$routeParams.id - 1];
		console.log($scope.posts.length);

		if( typeof $scope.singlePost != 'undefined' )
		{
			if( $scope.singlePost.status == 'Publish')
			{
				$scope.postBtn = { 
					"btnSaveUrl": "#/posts",
					"btnSaveCall": "updatePost",
					"btnSaveName": "Update Draft",
					"btnMakeUrl": $scope.curPost(),
					"btnMakeCall": "draftPost",
					"btnMakeName": "Make Draft"
				};
			}
			else 
			{
				$scope.postBtn = { 
					"btnSaveUrl": "#/posts",
					"btnSaveCall": "savePost",
					"btnSaveName": "Save Draft",
					"btnMakeUrl": $scope.curPost(),
					"btnMakeCall": "publishPost",
					"btnMakeName": "Publish Post"
				};
			}
		}

		$scope.addCategory = function() {
			if( typeof $scope.newCategory == 'undefined' || $scope.newCategory == '' )
			{
				return false;
			}

			$scope.singlePost.categories.push({"cat_name":$scope.newCategory});
			$scope.newCategory = '';
		}

		$scope.removeCategory = function(remove) {
			$scope.singlePost.categories.splice($scope.findObj($scope.singlePost.categories,'cat_name',remove),1);
		}

		$scope.findObj = function(arr,attr,value) {
			for(var i = 0; i < arr.length; i++)
			{
				if( arr[i][attr] == value )
				{
					return i;
				}
			}
		}

		// pagination
		$scope.currentPage = 1;
		$scope.filteredPosts = [];
		$scope.maxSize = 5;
		$scope.numPerPage = 10;
		$scope.title = '';
		$scope.totalItems = $scope.posts.length;
		// $scope.totalPages = Math.ceil($scope.posts.length / $scope.numPerPage);

	  	$scope.filter = function() {
	  		$timeout(function() {
	  			if($scope.title.title == '')
	  			{
	  				return $scope.totalItems = $scope.posts.length;
	  			}

	  			return $scope.totalItems = $scope.filtered.length;
	  			// $scope.totalPages = Math.ceil($scope.filtered.length / $scope.numPerPage);
	  		}, 10);
	  	}

	  	$scope.setFilter = function(btn) {
	  		if(btn == '')
  			{
  				return $scope.totalItems = $scope.posts.length;
  			}

  			return $scope.totalItems = $scope.filtered.length;
	  	}

	  	$scope.$watch('currentPage + numPerPage', function() {
	    	var begin = (($scope.currentPage - 1) * $scope.numPerPage), 
	    		end = begin + $scope.numPerPage;

	    	$scope.filteredPosts = $scope.posts.slice(begin, end);
	  	});
	})

	$scope.getSaveBtns = function(status) {
		if( typeof status == 'undefined' || status == null || status == '' )
		{
			return false;
		}

		var btns = [],
			stringBtn = '';

		if( status == 'Draft')
		{
			btns = [
				{ "btnName":"Save Draft","btnCall":"savePost","btnUrl":"#/posts"}, 
				{ "btnName":"Publish Post","btnCall":"publishPost","btnUrl":"#" + $scope.curPost()}
			];
		}
		else 
		{
			btns = [
				{ "btnName":"Update Post","btnCall":"updatePost","btnUrl":"#/posts"}, 
				{ "btnName":"Make Draft","btnCall":"draftPost","btnUrl":"#" + $scope.curPost()}];
		}

		var url = "#/?action=";

		angular.forEach(btns, function(v,k) {
			stringBtn += '<a href="' + v.btnUrl + '" class="' + v.btnCall + '" ng-click="$scope.sendPost(\'' + v.btnCall + '\')">' + v.btnName + '</a>';
		});

		return $sce.trustAsHtml(stringBtn);
	}

	$scope.sendPost = function(call) {
		console.log($scope.singlePost);
		console.log('$scope.singlePost');
		/*
			title
			date
			status
			content
			categories

		Callback.php?action=savePost&title=title&date=date&status=status&content=content&categories=categories

		*/
	}

	$scope.delPost = function(id) {
		confirm(id);
	}

	$scope.scrollTo = function() {
		$location.hash('top');
		$anchorScroll();
	}
})

.controller('jnusers', function($scope,$http) {
	$http.get('json/all-users.json').success(function(data) {
		$scope.users = data;
	});
})

.controller('jnaccount', function($scope,$http,User) {
	$scope.user = User;
	// $http.get('json/users.json').success(function(data) {
	// 	$scope.user = data;
	// });
})

.directive('menu', function() {
	return {
		restrict: "E",
		template: "<li ng-repeat=\"menu in menus\" class=\"menu\"><a href=\"{{menu.menuName | lowercase}}\" ng-class=\"{'active': menu.menuName == getMenu()}\">{{ menu.menuName }}</a></li>",
		replace: true
	}
})

.directive('btn',function() {
	return {
		restrict: "E",
		scope: {},
		template: '<a href="{{ url }}{{ btnCall }}">{{ btnName }}</a>',
		replace: true,
		link: function(scope, element, attrs) {
			scope.url = '#/?action=test';
			scope.btnCall = attrs.call;
			scope.btnName = attrs.name;
		}
	}
})

.directive('filterbtn', function() {
	var className = 'tOn';

	return {
		restrict: "A",
		link: function(scope, element) {
			element.on('click',function() {
				if( element.parent().find('.' + className).length > 0 )
				{
					element.parent().find('.' + className).removeClass(className);	
				}
				if( element.text() == 'Clear')
				{
					element.parent().find('.btn').removeClass(className);
					return;
				}
				element.toggleClass(className);
			})
		}
	}
})

.config(function($routeProvider,$locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		// requireBase: false
	});

	$routeProvider
		.when('/',{
			controller: 'jnposts',
			templateUrl: 'templates/posts.html'
		})
		.when('/dashboard', {
			controller: 'jnposts',
			templateUrl: 'templates/dashboard.html'
		})
		.when('/posts', {
			controller: 'jnposts',
			templateUrl: 'templates/posts.html'
		})
		.when('/posts/:id', {
			controller: 'jnposts',
			templateUrl: 'templates/singlepost.html'
		})
		.when('/users', {
			controller: 'jnusers',
			templateUrl: 'templates/user.html'
		})
		.when('/my-account', {
			controller: 'jnaccount',
			templateUrl: 'templates/account.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
})

.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
})

/*
| 	Only here for reference. Not needed for project.
| 	Another way to bind html
| 	html
|	<div ng-bind-html="getSaveBtns(singlePost.status) | unsafe"></div>
*/

.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.factory('Posts', function($http) {
	return {
		getPosts: function() {
			return $http.get('json/posts.json').then(function(response) {
				console.log(response.data);
				return response.data;
			});
		}
	}
})

.factory('User', function($cookies) {
	if( typeof $cookies.jnuser != 'undefined' )
	{
		var userCookie = $cookies.jnuser
			userArr = userCookie.split('|');

		return {
			"user_id": userArr[0],
			"username": userArr[1],
			"img": userArr[2],
			"bgimg": userArr[3],
		};
	}

});