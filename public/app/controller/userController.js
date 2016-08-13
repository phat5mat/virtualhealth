/**
 * Created by REN on 7/28/2016.
 */

var userApp = angular.module('mainApp');
    userApp.controller('userController',['$scope','$location','$http','userServices','facultyServices','$filter','$state','$auth',
        function ($scope,$location,$http,userServices,facultyServices,$filter,$state,$auth) {

            var upId = null;

            
        $scope.loadUsers = function(){
            userServices.get()
            .then(function(userData) {
                $scope.users = userData.data;
                $scope.loading = false;
            },
            function(e){
                $scope.error = e;
            })};


        $scope.signup = function(){
                $state.go('signup');
            }

        $scope.showPatForm = function(){
            $scope.patForm = true;
            $scope.selectRole = false;
        }

        $scope.showDocForm = function(){
            $scope.docForm = true;
            $scope.selectRole = false;
            facultyServices.get().then(function(facData) {
                $scope.facList = facData.data;
            },function(e){
                console.log('get Fac Error');
            });

        }

        $scope.backForm = function(){
            $scope.docForm = false;
            $scope.patForm = false;
            $scope.selectRole = true;
        }



        $scope.register = function() {
            $scope.loading = true;
            var dateFilter = $filter('date')($scope.user.dateinput, 'yyyy-MM-dd');
            $scope.user.dateofbirth = dateFilter;
            userServices.save($scope.user)
                .then(function(data) {
                    $scope.patForm = false;
                    $scope.docForm = false;
                    $scope.successPage = true;

                },
                    function(e) {
                        console.log(e);
                });
        };


        $scope.removeUser = function(id,role) {
            $scope.loading = true;
            userServices.destroy(id,role)
                .then(function(data) {
                    userServices.get()
                        .then(function(userData) {
                            $scope.users = userData.data;
                            $scope.loading = false;
                        },function(e){
                            console.log(e);
                        });
                }
                ,function(e) {
                    console.log(e);
                });
        };


        $scope.fillUserUpdate = function(upUser){
            upId = upUser['docid'];
            $scope.user = {
                name: upUser['name'],
                password: upUser['password'],
                phone: upUser['phone'],
                email: upUser['email'],
            }
        }

        $scope.updateUser = function(){
            userServices.updte(upId,$scope.doctor)
                .then(function (data) {
                    docServices.get()
                        .success(function(userData) {
                            console.log('Success');
                        });
                }
                ,function(e) {
                    console.log(e);
                });
        }
    }]);





    

