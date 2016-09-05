/**
 * Created by REN on 8/10/2016.
 */
/**
 * Created by REN on 8/5/2016.
 */

var app = angular.module('appointmentServices', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('appointmentServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "room");
        },

        
        findbydoctor: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "findbydoctor/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        patientappoint: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patAppointmentList/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getslotnumber: function(slot){
            return $http({
                method:'POST',
                url: API_URL + "getslotnumber",
                data: $.param(slot),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        },
        
        save : function(appData){
            return $http({
                method: 'POST',
                url: API_URL + "appointment",
                data:  $.param(appData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "appointment/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        
        update : function(id,appData){
            return  $http({
                method: 'POST',
                url: API_URL + "appointment/" + id,
                data:  $.param(appData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },



    }
})

