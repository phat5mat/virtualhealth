/**
 * Created by REN on 7/28/2016.
 */
var app = angular.module('userServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('userServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "user");
        },

        save : function(userData){
            return $http({
                method: 'POST',
                url: API_URL + "user",
                data:  $.param(userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "user/" + id
            });
        },

        update : function(id,userData){
            return  $http({
                method: 'POST',
                url: API_URL + "user/" + id,
                data:  $.param(userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        

     
    }
})

