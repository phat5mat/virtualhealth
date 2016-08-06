/**
 * Created by REN on 8/5/2016.
 */

var app = angular.module('roomServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('roomServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "user");
        },

        save : function(roomData){
            return $http({
                method: 'POST',
                url: API_URL + "user",
                data:  $.param(roomData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        destroy : function(id,role){
            return $http({
                method: 'DELETE',
                url: API_URL + "user/" + id,
                data: $.param(role),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        update : function(id,roomData){
            return  $http({
                method: 'POST',
                url: API_URL + "user/" + id,
                data:  $.param(roomData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },



    }
})

