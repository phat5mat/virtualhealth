var app = angular.module('doctorServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('doctorServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "doctor");
        },

        findByUser : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "docbyuser/" + id
            });
        },

        findByRequest : function(){
            return $http({
                method: 'GET',
                url: API_URL + "docbyrequest/"
            })
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

