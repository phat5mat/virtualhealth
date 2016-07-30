/**
 * Created by REN on 7/30/2016.
 */
var app = angular.module('patientServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('patServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "doctor");
        },

        save : function(patData){
            return $http({
                method: 'POST',
                url: API_URL + "patient",
                data:  $.param(patData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "patient/" + id
            });
        },

        update : function(id,patData){
            return  $http({
                method: 'POST',
                url: API_URL + "patient/" + id,
                data:  $.param(patData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }
})

