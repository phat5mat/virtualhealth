/**
 * Created by REN on 8/1/2016.
 */


'use strict';

angular
    .module('mainApp')
    .controller('authController',['$scope','$auth','$state','$location','$http','$rootScope','$window',
        'patientServices','doctorServices','$mdToast','$timeout',
        function ($scope,$auth,$state,$location,$http,$rootScope,$window,patientServices,doctorServices,
                  $mdToast,$timeout){
    
            $scope.login = function() {
                $timeout(function(){
                    $scope.loading = true;
                });
                var credentials = {
                    username: $scope.username,
                    password: $scope.password
                };

                // Use Satellizer's $auth service to login
                $auth.login(credentials).then(function(data) {

                    // If login is successful, redirect to the users state
                    return $http.get('api/authenticate/user');

                }, function(error) {
                    $timeout(function(){
                        $scope.loading = false  ;
                    });
                    $scope.loginValidate = true;
                }).then(function(response){

                    try{
                        // Stringify the returned data to prepare it
                        // to go into local storage
                        var user = JSON.stringify(response.data.user);

                        // Set the stringified user data into local storage
                        localStorage.setItem('user', user);

                        // The user's authenticated turn into true
                        $rootScope.authenticated = true;

                        // Set current user data to rootScope that help accessing through the app
                        $rootScope.currentUser = response.data.user;

                        //Check user's role and store user data to localStorage and rootScope
                        // handle if user is patient
                        if($rootScope.currentUser['role'] ==  0)
                        {
                            patientServices.findByUser($rootScope.currentUser['id'])
                                .then(function(response){
                                    var patUser = response.data;
                                    $rootScope.patUser = patUser;
                                    localStorage.setItem('patUser',JSON.stringify(patUser));
                                    $mdToast.show($mdToast.simple().textContent('Welcome backl!'));
                                    $state.go('home.pat');
                                },function(e){
                                    console.log(e.data.error);
                                });
                        }

                        // handle if user is doctor
                        if($rootScope.currentUser['role'] ==  1)
                        {
                            doctorServices.findByUser($rootScope.currentUser['id'])
                                .then(function(response){
                                    var docUser = response.data;
                                    $rootScope.docUser = docUser;
                                    localStorage.setItem('docUser',JSON.stringify(docUser));
                                    $mdToast.show($mdToast.simple().textContent('Welcome back!'));
                                    $state.go('home.doc');
                                },function(e){
                                    console.log(e.data.error);
                                });
                        }

                        // handle if user is staff
                        if($rootScope.currentUser['role'] == 2)
                        {
                            doctorServices.findByUser($rootScope.currentUser['id'])
                                .then(function(response){
                                    var staffUser = response.data;
                                    $rootScope.staffUser = staffUser;
                                    localStorage.setItem('staffUser',JSON.stringify(staffUser));
                                    $mdToast.show($mdToast.simple().textContent('Welcome back!'));
                                    $state.go('home.staff');
                                },function(e){
                                    console.log(e.data.error);
                                });
                        }

                    }catch(e){
                        $scope.loginValidate = true;
                    }

                    
                });
                $scope.loading = false;

            };
            $rootScope.$on("signOut", function(){
                $scope.signout();
            });

            $scope.signout = function(){
                $auth.logout().then(function(){
                    $state.go('login');
                    localStorage.clear();
                    $rootScope.authenticated = false;
                    $rootScope.currentUser = null;
                    $rootScope.docUser = null;
                    $rootScope.patUser = null;
                    $rootScope.staffUser = null;

                },function(e){
                    console.log(e);
                })
            }
            
           
        }]);