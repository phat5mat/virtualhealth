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
                $scope.loading = true;
                var credentials = {
                    username: $scope.username,
                    password: $scope.password
                }

                // Use Satellizer's $auth service to login
                $auth.login(credentials).then(function(data) {

                    // If login is successful, redirect to the users state
                    return $http.get('api/authenticate/user');

                }, function(error) {
                    console.log(error);
                }).then(function(response){

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
                            },function(e){
                                console.log(e.data.error);
                            });
                        $state.go('home.pat');
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
                            },function(e){
                                console.log(e.data.error);
                            });
                        $state.go('home.doc');
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
                            },function(e){
                                console.log(e.data.error);
                            });
                        $state.go('home.staff');
                    }
                    
                    
                });
                $scope.loading = false;

            }
            
            $scope.signout = function(){
                $auth.logout().then(function(){
                    $state.go('login');
                    localStorage.removeItem('user');
                    localStorage.removeItem('docUser');
                    localStorage.removeItem('patUser');
                    localStorage.removeItem('staffUser');
                    localStorage.removeItem('sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7feuuid');
                    localStorage.removeItem('undefineduuid');
                    localStorage.removeItem('satellizer_token');
                    $rootScope.authenticated = false;
                    $rootScope.currentUser = null;
                    $rootScope.docUser = null;
                    $rootScope.patUser = null;
                    
                },function(e){
                    console.log(e);
                })
            }
            
           
        }]);