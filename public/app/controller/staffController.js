/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('staffController',['$scope','$location','$http','userServices','doctorServices','$filter','$state','$auth',
    '$stateParams','$mdToast','$q',
    function ($scope,$location,$http,userServices,doctorServices,$filter,$state,$auth,$stateParams,$mdToast,$q) {

        $scope.loading = true;
        $scope.loadRequest = function(){
            doctorServices.findByRequest()
                .then(function(userData) {
                    $scope.users = userData.data;
                    // Convert status into text
                    angular.forEach($scope.users,function(user, key) {
                       if(user['status'] == 0)
                            $scope.users[key].status = 'Pending'
                    });
                    $scope.loading = false;
                    if($scope.users.length == 0)
                        $scope.req = 0;
                    }, function(e){
                        console.log(e);
         })};

        $scope.checkRequest = function(){
            doctorServices.checkRequest()
                .then(function(requestData){
                    $scope.req = requestData.data;
                    $scope.loading = false;
            },function(e){
                console.log(e);
            })
        }

        $scope.selectRequest = function(doctor){
            $state.go('reviewDoctor', {doctor:doctor});
        }

        $scope.loadRequestDetails = function(){
            $scope.doctor = $stateParams.doctor;
            $scope.checkRequest();
        }
        
        $scope.approveRequest = function(){
            doctorServices.approveRequest($scope.doctor.id)
                .then(function(data){
                    $state.go('viewRequest')
                    $mdToast.show($mdToast.simple().textContent('Doctor ' + $scope.doctor.user.name + ' is ' +
                        'actived!!'));
                },function(e){
                    console.log(e);
                })
        }

        $scope.rejectRequest = function(){
            doctorServices.rejectRequest($scope.doctor.id)
                .then(function(data){
                    $state.go('viewRequest')
                    $mdToast.show($mdToast.simple().textContent('Doctor ' + $scope.doctor.user.name + ' is ' +
                        'rejected!!'));
                    $scope.checkRequest();
                },function(e){
                    console.log(e);
                })
        }


    }]);





    

