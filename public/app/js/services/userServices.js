/**
 * Created by REN on 7/28/2016.
 */
var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('userServices',function($http,API_URL,$rootScope){
    return {
        get : function(){
            return $http.get(API_URL + "user");
        },

        findUserByID: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "finduserbyid/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        findUserByDoc : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "finduserbydoc" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        validatePass : function(passData){
            return $http({
                method: 'POST',
                url: API_URL + "validatepass",
                data:  $.param(passData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        changePass : function(passData){
            return $http({
                method: 'POST',
                url: API_URL + "changepass",
                data:  $.param(passData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        saveAvatar: function(img){

            var fd = new FormData();
            //Take the first selected file
            fd.append("file", img);

            return $http({
                method: 'POST',
                withCredentials: true,
                url: API_URL + "saveavatar",
                transformRequest: angular.identity,
                data: fd,
                headers: {'Content-Type': undefined}
            });
        },
        
        
        save : function(userData){
            return $http({
                method: 'POST',
                url: API_URL + "user",
                data:  $.param(userData),
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

        
        update : function(id,userData){
            return  $http({
                method: 'PUT',
                url: API_URL + "user/" + id,
                data:  $.param(userData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
     
    }
})

