/**
 * Created by REN on 7/30/2016.
 */
var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('patientServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "doctor");
        },
        
        
        findByUser : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patbyuser/" + id
            });
        },

        findByUserWithUser : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patbyuserwith/" + id
            });
        },


        findByRoom : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patbyroom/" + id
            }); 
        },

        findByUsername : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patbyusername/" + id
            });
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

