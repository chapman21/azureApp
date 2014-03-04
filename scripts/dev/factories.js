angular.module("factories", [])


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
					url: baseUrl + "?",
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
					url:'https://treystest.azure-mobile.net/api/test/',
					isArray: true
				},
				changeText:{
					url: baseUrl,
					id: '@param',
					method: 'PATCH'
				},
				allTasks:{
					url:baseUrl,
					method:"GET",
					isArray:true
				},
				removeTask:{
					url:baseUrl,
					method:"DELETE",
					param: '@param'
				}


		});
});
























