/**
 * Created by REN on 9/16/2016.
 */
/**
 * Created by REN on 8/10/2016.
 */
/**
 * Created by REN on 8/5/2016.
 */

var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.service('examinationServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "exam");
        },
        

        save : function(examData){
            return $http({
                method: 'POST',
                url: API_URL + "examination",
                data:  $.param(examData),
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
        
        getExamByPatient: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "exambypatient/" + id
            })
        },

        getExamByAppointment: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "exambyappoint/" + id
            })
        }



    }
})

