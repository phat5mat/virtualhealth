/**
 * Created by REN on 8/5/2016.
 */

var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('roomServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "room");
        },


        findroombydoctor: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "findroombydoctor/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        
        save : function(roomData){
            return $http({
                method: 'POST',
                url: API_URL + "room",
                data:  $.param(roomData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "room/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        update : function(id,roomData){
            return  $http({
                method: 'PUT',
                url: API_URL + "room/" + id,
                data:  $.param(roomData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

    }
})

