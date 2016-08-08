/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var userApp = angular.module('mainApp');
userApp.controller('patientController',['$scope','$location',
    '$http','userServices','facultyServices','doctorServices','$filter','$state','$auth',
    function ($scope,$location,$http,userServices,facultyServices,doctorServices,$filter,$state,$auth) {

        $scope.loadDoctors = function(){
            doctorServices.get().
                then(function(response){
               $scope.doctors = response.data
                console.log(response.data);
            },function(e){
                console.log(e.data.error);
            })
        }
        
    }]);





    

