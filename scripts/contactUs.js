angular.module("KnowledgePortal",['ngResource','globals','factories'])//.value('$anchorScroll', angular.noop)

.config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider, $httpProvider){
			$httpProvider.defaults.headers.get = {
				'Accept' : 'application/json, text/javascript, */*'
			};
				$httpProvider.defaults.headers.common['X-ZUMO-APPLICATION'] = 'hNXqPpmseUSFJGgCgAFoeqVxDRJmEI93'; // add the application key
				$httpProvider.defaults.headers.common['Content-Type'] = 'Application/json';
			$httpProvider.defaults.headers.patch = {
				'Content-Type': 'application/json;charset=utf-8'
			}
			$httpProvider.defaults.headers.post = {
				'Content-Type': 'application/json;charset=utf-8'
			}



			$routeProvider
					.when('/ContactUs', {
						controller : 'StepOneController',
						templateUrl : 'views/stepOne.html'
					})
					.otherwise({
						redirectTo : '/ContactUs'
					});
}])

.controller('StepOneController', ['$scope','$location','$timeout','Task', function($scope, $location, $timeout, Task){

			function Person(name){
				this.name = name;
			}
			Person.prototype.sayName = function(){
				console.log("Hello " + this.name)
			}

			var person1 = new Person("Trey");

			console.log(person1.name);
			person1.sayName();

/*
			function Person(){
			}

			var person1 = new Person();
			console.log(person1)
*/


























			//var todoItemTable;
			//var a = Task.addTask();
			//a.where({complete: false});
			//todoItemTable = $scope.tasks;
			//var a = "Yea!";
			//var DTO ={
				//"text": "Do it!",
				//"complete":"false",
				//"newColumn" : 'Yea!'
			//};

			/*Task.completed({param:"?$filter=(complete eq false)" +
					"and" +
					"(newColumn eq '" + a + "')"
			}, successcb, errorcb)
			*/
			//Task.update({ id: , text: newText }).then(null, handleError);
			//Task.addTask({},successcb, errorcb);
			//function successcb(data){
			//console.log(data)
			//}
			//function errorcb(err){
				//console.log(err)
			//}
}])



/*
query.where(function (name, level) {
	return this.assignee == name && this.difficulty == level;
}, "david", "medium").read().done(function (results) {
			alert(JSON.stringify(results));
		}, function (err) {
			alert("Error: " + err);
		});
*/

















.controller('StepTwoController', ['$scope','$location','$timeout', function($scope, $location, $timeout){
			var stepOne= sessionStorage.stepOne;
			var vehicles= sessionStorage.vehicles;
			var vehicleInfo= sessionStorage.vehicleInfo;
			var description= sessionStorage.description;
			if(stepOne === undefined){
				$location.path("/StepOne");
			}
			if(vehicles){
				$scope.vehicles = true;
			}
			if(vehicleInfo !== undefined && description !== undefined){
				var two = sessionStorage.getItem('vehicleInfo');
				var cdTwo = JSON.parse(two);
				var formFill = {
				fillIt : function() {
					$scope.details = sessionStorage.description;
					$scope.title = cdTwo.title;
					$scope.vvin = cdTwo.vin;
					$scope.vplate = cdTwo.plate;
					}
				}
				$timeout(formFill.fillIt, 100);
			}else if(vehicleInfo === undefined && description){
				var formFill = {
				fillIt : function() {
					$scope.details = sessionStorage.description;
				}
				}
				$timeout(formFill.fillIt, 100);
			}
			$scope.next = function(){
				if(vehicles){
					var vehicleInfo = {
						title : $scope.title,
						vin : $scope.vvin,
						plate : $scope.vplate
					}
					sessionStorage.setItem('vehicleInfo', JSON.stringify(vehicleInfo));
				}
				sessionStorage.custnumber= $scope.customernumber;
				sessionStorage.description= $scope.details;
				$location.path("/Verify")
			};
			$scope.back = function() {
				$location.path("/StepOne")
			};
}])

.controller('VerifyController',['$scope','$location','ContactFactory', function($scope, $location, ContactFactory){
			var one;
			var vehicles= sessionStorage.vehicles;
			var vehicleInfo= sessionStorage.vehicleInfo;
			var stepOne= sessionStorage.stepOne;
			var description= sessionStorage.description;
			var subject= sessionStorage.subj;
			var two;
			var cdOne;
			var cdTwo;
			var data={};
			$scope.dis= true;
			$scope.verify = true;
			sessionStorage.complete = "yes";
			if(vehicles){
				$scope.vehicles= true;
				$scope.vary= "sing"
			}else{
				$scope.vary= "sec"
			}
			if(!stepOne && !description){
				$location.path("/StepOne");
			}else{
				one = sessionStorage.getItem('stepOne');
				cdOne = JSON.parse(one);
				data = {
					firstname  : cdOne.firstname,
					lastname  : cdOne.lastname,
					phone  : cdOne.phone,
					email : cdOne.email,
					subject : cdOne.subject,
					realSubject : subject,
					custnumber : cdOne.custnumber,
					description : sessionStorage.description
				};
				if(vehicleInfo){
					two = sessionStorage.getItem('vehicleInfo');
					cdTwo = JSON.parse(two);
					data.title = cdTwo.title;
					data.vin= cdTwo.vin;
					data.plate= cdTwo.plate;
				}
				if(cdOne.subject === 'ot'){
					data.realSubject = undefined;
				}
				if(cdOne.phone !== undefined && cdOne.phone.indexOf('555555') !==-1){
					data.phone = undefined;
				}
				$scope.subj= subject;
				$scope.mail = data.email;
				$scope.theData = [data];
				var DTO ={
					"oContactUsFields":data
				};
				$scope.addResponse = function(x) {
					data.response = x;
					$scope.dis= false;
				};
				}
			$scope.edit = function(x){
				$location.path('/' + x)
			}
			$scope.next = function(){
			$scope.isloading = true;
			sessionStorage.setItem('data', JSON.stringify(data));
			ContactFactory.contactInfo({}, DTO, successcb, errorcb);
		};
			function successcb(data){
				$scope.verify = false;
				$location.path('/Complete');
			}
			function errorcb(data){
				$scope.err = data.status
			}
}])

.controller('CompleteController',['$scope','$location','$timeout', function($scope, $location, $timeout){
			var data= sessionStorage.data;
			var theData;
			var formFill;
			if(data === undefined){
				$location.path("/ContactUs");
			}else{
				theData = sessionStorage.getItem('data');
				data = JSON.parse(theData);
				$scope.theData = [data];
				_gaq.push(['_trackEvent', 'Contact Form Completed!', 'ContactUs']);
				formFill = {
					fillIt : function() {
					sessionStorage.clear();
					}
				}
				$timeout(formFill.fillIt, 1500);
			}
			$scope.next = function(){
				window.location.replace("/");
			}
}]);var base = "views/directiveTemplates/";
angular.module("directives", [])




/*

.directive('loginDetails', function () {
      return {
         restrict: "A",
         replace: true,
         scope:{
             number : "@number"
         },
         templateUrl:"views/directiveTemplates/loginDetails.html" 
        }
     })

*/


.directive('placeholder', ['$timeout', function($timeout){
      if (navigator.userAgent.indexOf("MSIE") < 0) {
        return{
            
        }
    }
   if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
       var s = new Number(RegExp.$1);
       if (s > 10) {
           return
           }else{
               return {
                   link: function(scope, elm, attrs){
                       if (attrs.type === 'password'){
                           return;
                           }
                           $timeout(function(){
                               elm.val(attrs.placeholder).focus(function(){
                                   if ($(this).val() == $(this).attr('placeholder')) {
                                       $(this).val('');
                                       }
                                       }).blur(function(){
                                           if ($(this).val() == ''){
                                               $(this).val($(this).attr('placeholder'));
                                               }});});
                                          }}}}}])
                                          
                                          


.directive('button', function(){
    return{
        restrict: 'E',
        compile: function(element, attributes){
            element.addClass('orgBtn')
        }
    };
})




.directive('custnumber', ['$parse',function($parse, $templateCache){
    return{
        restrict: "A",
        link: function(scope, elm, iAttrs, controller) {
            var a = $('input').attr('name');
            scope.$watch(a, function(value) {
                if (!value) {
                    return;
                }
                if(value.indexOf("-") !==-1 && value.length === 11){
                     $parse(a).assign(scope, value.replace(/-/g, ''));
                }
            });
        }
    }
}])




/*

.directive('vin', function(){
    return{
        restrict: "E",
        replace: true,
        templateUrl:base + "vin.html",
         link: function(scope, elm, attrs){
         }
    };
})




.directive('description', function(){
    return{
        restrict: "E",
        replace: true,
        templateUrl:base + 'description.html'
    }
})




.directive('yesno', function(){
    return{
        restrict: "E",
        replace: true,
          templateUrl:base + 'yesnoRadio.html'
        
    };
});

*/












;angular.module("factories", [])


.factory('message', function() {
    return []
})


.factory('ContactFactory',['$resource', function($resource) {
    //var baseUrl = "http://10.156.147.121:443\:443/WebServicesBackEnd/ContactUs.aspx/SendFields";
		var baseUrl = "/apps/WebServicesBackEnd/ContactUs.aspx/SendFields";
    return $resource(baseUrl, {}, {
        contactInfo : {
            method : 'Post',
            url : baseUrl
        }
    });
}])

.factory('Task', function($resource) { // declaring a MyTable resource
			var baseUrl= "https://treystest.azure-mobile.net/tables/todoitem/:param"
			return $resource(baseUrl,{},{
				notCompleted :{
					method: 'GET',
					url: baseUrl,
					param: '@param',
					isArray: true
				},
				completed:{
						method: 'GET',
						url: baseUrl,
						param: '@param',
						isArray: true
				},
				addTask:{
					method: 'POST',
					url: baseUrl + 'https://treystest.azure-mobile.net/api/test/',
					isArray: true
				},
				changeText:{
					url: baseUrl,
					id: '@param',
					method: 'PATCH'
				}


		});
});
























