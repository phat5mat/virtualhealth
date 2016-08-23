/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('userController',['$scope','$location','$http','userServices','doctorServices','$filter','$state','$auth',
    function ($scope,$location,$http,userServices,doctorServices,$filter,$state,$auth) {

        $scope.loadRequest = function(){
            doctorServices.get()
                .then(function(userData) {
                        $scope.users = userData.data;
                        $scope.loading = false;
                    },
                    function(e){
                        $scope.error = e;
         })};


    }]);





    

