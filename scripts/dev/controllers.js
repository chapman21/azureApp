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
			var todoItemTable;
			//var a = Task.addTask();
			//a.where({complete: false});
			//todoItemTable = $scope.tasks;
			var a = "Yea!";
			var DTO ={
				"text": "Do it!",
				"complete":"false",
				"newColumn" : 'Yea!'
			};

			/*Task.completed({param:"?$filter=(complete eq false)" +
					"and" +
					"(newColumn eq '" + a + "')"
			}, successcb, errorcb)
			*/
			//Task.update({ id: , text: newText }).then(null, handleError);
			Task.addTask({},successcb, errorcb);
			function successcb(data){
			console.log(data)
			}
			function errorcb(err){
				console.log(err)
			}
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
}])