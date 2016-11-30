/**
 * Created by REN on 8/10/2016.
 */
/**
 * Created by REN on 8/5/2016.
 */

var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('appointmentServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "room");
        },

        findbyid: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "patbyid/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        doctorappoint: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "doctorappoint/" + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        doctorappoint2: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "doctorappoint2/" + id,
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
        
        examappoint: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "examappoint/" + id,
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

        updateStatus: function(id,status){
            return  $http({
                method: 'PUT',
                url: API_URL + "updateAppointStatus/" + id,
                data:  {status: status}
            });
        },

        updateStatusIndividual: function(id,status){
            return  $http({
                method: 'PUT',
                url: API_URL + "updateAppointStatusIndividual/" + id,
                data:  {status: status}

            });
        },
        updateAppointmentStatusExpired: function(id,status){
            return  $http({
                method: 'PUT',
                url: API_URL + "updateAppointmentStatusExpired/" + id,
                data:  {status: status}

            });
        },
        
        checkExist: function(existData){
            return $http({
                method: 'POST',
                url: API_URL + "checkAppointExist",
                data:  $.param(existData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
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

