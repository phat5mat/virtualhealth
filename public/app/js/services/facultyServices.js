/**
 * Created by REN on 7/30/2016.
 */

var app = angular.module('facultyServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('facultyServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "fac");
        },

        save : function(facData){
            return $http({
                method: 'POST',
                url: API_URL + "fac",
                data:  $.param(userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "fac/" + id
            });
        },

        update : function(id,facData){
            return  $http({
                method: 'POST',
                url: API_URL + "fac/" + id,
                data:  $.param(userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }
})

