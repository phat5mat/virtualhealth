var app = angular.module('doctorServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('docServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "doctor");
        },

        save : function(docData){
            return $http({
                method: 'POST',
                url: API_URL + "doctor",
                data:  $.param(docData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "doctor/" + id
            });
        },

        update : function(id,docData){
          return  $http({
                method: 'POST',
                url: API_URL + "doctor/" + id,
                data:  $.param(docData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }
})

