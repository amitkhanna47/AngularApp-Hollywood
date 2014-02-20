var app = angular.module('entApp',[]);

app.config(function($routeProvider){
	$routeProvider
	.when(
		"/home",
		{
			action:"front.home"
		}
	)
	.when(
		"/latest/:latestType/:categoryId",
		{
			action:"standard.latest.list"
		}
	)	
	.when(
		"/latest/:latestType/:categoryId/:moviId",
		{
			action:"standard.latest.movi_details.details"
		}
	)
	.when(
		"/latest/:latestType/:categoryId/:moviId/posters",
		{
			action:"standard.latest.movi_details.posters"
		}
	)
	.when(
		"/latest/:latestType/:categoryId/:moviId/castcrew",
		{
			action:"standard.latest.movi_details.cast"
		}
	)
	.when(
		"/credits",
		{
			action:"standard.credits"
		}
	)
	.otherwise(
		{
			redirectTo:"/home"
		}
	)
});

app.service("requestService",function(){	

	function setContext(action){
		sections = action.split('.');			
		//console.log(sections);

	}	

	function getSection(prefix){
				
		if(action.indexOf(prefix + '.') == -1)
		{			
			return;
			
		}
	
		if(prefix==undefined || prefix=="")
		{
			console.log(sections[0]); 
			return sections[0];
		}			
		console.log(sections[prefix.split('.').length]);
		
		if(sections[prefix.split('.').length] == 'movi_details'){
			global.anim = true;			
			//console.log(global.anim);			
		}
		
		return sections[prefix.split('.').length];		
	}
	
	return({
		setContext:setContext,
		getSection:getSection
	})
});


app.service("dataService",function($http){
	var prefix_url = "http://api.themoviedb.org";
	function getData(url, addParams){
			
		url = addParams ? prefix_url + url + "?api_key=b293ffe7d4a175c739c5902ef154a554&callback=JSON_CALLBACK" + addParams : prefix_url + url + "?api_key=b293ffe7d4a175c739c5902ef154a554&callback=JSON_CALLBACK";
		//console.log(url);		
		return $http.jsonp(url);	
				
	}
	
	var urlLink;
	var sizer;
	function setPath(data, url, size){	
		sizer = "";
		if(!urlLink) urlLink = url || "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
				
		if(!sizer){			
			sizer = size || "w185";			
		} 
		var comUrl = urlLink + sizer;				
			
		angular.forEach(data, function(val, key){
			if(angular.isObject(val)){
				setPath(data[key], null, size);
			}
			else
			{
				if(angular.isString(val)){
					if(val.match(/jpg/g))
					{
						data[key] = comUrl + data[key];
					}
				}
			}	
		});
		//console.log(sizer);
		//sizer = "";						
		return data;				
	}
	
	return {getData:getData, setPath:setPath};
});

app.controller('appCtrl',function($scope, $route, $rootScope, $routeParams, $timeout, requestService, dataService){
	global = $scope;
	$scope.anim = false;
	
	$scope.$on("$routeChangeSuccess",function(){
		$scope.anim = false;		
		action = $route.current.action;
		requestService.setContext($route.current.action);

		$scope.$broadcast('$requestContextChanged',requestService);
	});	

	$scope.$on("$requestContextChanged",function(){		
		$scope.subview = requestService.getSection("");
	});			
	
	dataService.getData("/3/movie/now_playing").success(function(data){			
			$scope.dataTmp = dataService.setPath(data, null, "w185");
			//console.log(data);
			$scope.fadeRandomRepeat(9);			
		});
		
	$scope.fadeRandomRepeat = function(limit){			
			var pages = Math.floor($scope.dataTmp.results.length / limit);
			var backupResults = $scope.dataTmp.results;		
			$scope.data = $scope.dataTmp;	
			var s = 0, e = limit, time = 0;					
			function timeout(){
				if(pages){					
					console.log(s); console.log(e); console.log(time);
					var appCtrlTime = $timeout(function(){
						$scope.data.results = backupResults;	
						//console.log($scope.data.results);					
						$scope.data.results = $scope.data.results.slice(s,e);						
						//console.log($scope.data.results);
						s=limit+1, e=limit+limit+1, time=5000, pages--;												
						timeout();							
					},time);	
				}
			}			
			timeout();	
	}
		
			
});

app.controller('frontCtrl',function($scope, $route, requestService, dataService){
		$scope.subview = requestService.getSection('front');			
		
		$scope.$on("$requestContextChanged",function(){
			$scope.subview = requestService.getSection('front');
		});			
		
});

app.controller('standardCtrl',function($scope, $route, $routeParams, requestService){
		$scope.subview = requestService.getSection('standard');
		$scope.$on("$requestContextChanged",function(){
			$scope.subview = requestService.getSection('standard');
		});		
		$scope.latestType = $routeParams.latestType;		
});

app.controller('latestCtrl',function($scope, $route, $routeParams, requestService, dataService){
		$scope.subview = requestService.getSection('standard.latest', $scope);		
		
		$scope.$on("$requestContextChanged",function(){
			$scope.subview = requestService.getSection('standard.latest', $scope);
		});			
		
		$scope.latestType == 'released' ? req=dataService.getData("/3/movie/now_playing") : $scope.latestType == 'upcoming' ? req = dataService.getData("/3/movie/upcoming") : '';
		
		req.success(function(data){			
			$scope.data = data;
			$scope.data = dataService.setPath(data, null, "w185");
			//console.log(data);			
		});
		
});


app.controller('moviDetailsCtrl',function($scope, $route, $rootScope, $routeParams, requestService, dataService){		
		$scope.subview = requestService.getSection('standard.latest.movi_details');		
		$scope.moviId = $routeParams.moviId;
		$scope.$on("$requestContextChanged",function(){			
			$scope.subview = requestService.getSection('standard.latest.movi_details');
		});					
		dataService.getData("/3/movie/" + $routeParams.moviId + "/images").success(function(data){			
			$rootScope.moviPosters = dataService.setPath(data, null, "w1000");			
			//console.log($scope.moviPosters);			
		});
});

app.controller('moviDetailPageCtrl',function($scope, $route, $routeParams, requestService, dataService){
	dataService.getData("/3/movie/" + $routeParams.moviId).success(function(data){			
			//$scope.moviDetails = data;			
			$scope.moviDetails = dataService.setPath(data, null, "w500");
			//console.log(data);			
		});		
});

app.controller('moviPosterPageCtrl',function($scope, $route, $routeParams, requestService, dataService){
				
});

app.controller('moviCastPageCtrl',function($scope, $route, $routeParams, requestService, dataService){
	dataService.getData("/3/movie/" + $routeParams.moviId + "/credits").success(function(data){			
			$scope.moviCast = dataService.setPath(data, null, "w92");						
			//console.log($scope.moviReviews);			
		});		
});


/* directive for detail page animation */
app.directive("innerFade", function () {
   var res = {
     restrict : 'C',
     link     : function (scope, element, attrs) {
         		if($(element).index() == 0) {         			
         			ani($(element));
         		}  		           		
        }
     };
  return res;
});


function ani(elem){
	elem.css('opacity',0);
	console.log(elem.css('opacity'));	
	elem.animate({opacity:1},3000, function(){
			$(this).animate({opacity:0},3000, function(){
					if($(this).next().length) ani($(this).next());
					else
					{						
						ani($('.hide img').eq(0));
					}
			});
	});		  
  	
}