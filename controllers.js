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
		"/latest/released/:categoryId",
		{
			action:"standard.latest.list"
		}
	)
	.when(
		"/latest/released/:categoryId/:moviId",
		{
			action:"standard.latest.movi_details.details"
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
		if(prefix==undefined || prefix=="") return sections[0];		
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
		if(!urlLink) urlLink = url || "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
				
		if(!sizer) sizer = size || "w185";				
		var comUrl = urlLink + sizer;
				
			
		angular.forEach(data, function(val, key){
			if(angular.isObject(val)){
				setPath(data[key]);
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
		console.log(sizer);
		sizer = "";						
		return data;				
	}
	
	return {getData:getData, setPath:setPath};
});

app.controller('appCtrl',function($scope, $route, requestService, dataService){

	$scope.$on("$requestContextChanged",function(){
		$scope.subview = requestService.getSection();
	});			


	$scope.$on("$routeChangeSuccess",function(){
		requestService.setContext($route.current.action);

		$scope.$broadcast('$requestContextChanged',requestService);
	});	
	
	dataService.getData("/3/movie/now_playing").success(function(data){			
			$scope.data = data;
			$scope.data = dataService.setPath(data, null, "w92");
			//console.log(data);			
		});
			
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
		
		$scope.param = $routeParams.categoryId;
		
		
		
});

app.controller('latestCtrl',function($scope, $route, $routeParams, requestService){
		$scope.subview = requestService.getSection('standard.latest');		
		
		$scope.$on("$requestContextChanged",function(){
			$scope.subview = requestService.getSection('standard.latest');
		});			
});


app.controller('moviDetailsCtrl',function($scope, $route, $routeParams, requestService, dataService){
		$scope.subview = requestService.getSection('standard.latest.movi_details');		
		
		$scope.$on("$requestContextChanged",function(){
			$scope.subview = requestService.getSection('standard.latest.movi_details');
		});			
});

app.controller('moviDetailPageCtrl',function($scope, $route, $routeParams, requestService, dataService){
	dataService.getData("/3/movie/" + $routeParams.moviId).success(function(data){			
			//$scope.moviDetails = data;			
			$scope.moviDetails = dataService.setPath(data, null, "w500");
			console.log(data);			
		});		
});



