/**
 * Created by REN on 7/30/2016.
 */

var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('specialityServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "special");
        },

        getSpecialByDoctor : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "specialbydoctor/"+id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });        
        },

        
        save : function(specData){
            return $http({
                method: 'POST',
                url: API_URL + "special",
                data:  $.param(specData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "special/" + id
            });
        },

        
        update : function(id,specData){
            return  $http({
                method: 'POST',
                url: API_URL + "special/" + id,
                data:  $.param(specData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }
})

