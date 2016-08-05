/**
 * Created by REN on 8/1/2016.
 */


'use strict';

angular
    .module('authMain')
    .controller('authController',['$scope','$auth','$state','$location','$http','$rootScope','$window',
        function ($scope,$auth,$state,$location,$http,$rootScope,$window){

            $scope.login = function() {

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

                    // The user's authenticated state gets flipped to
                    // true so we can now show parts of the UI that rely
                    // on the user being logged in
                    $rootScope.authenticated = true;

                    // Putting the user's data on $rootScope allows
                    // us to access it anywhere across the app
                    $rootScope.currentUser = response.data.user;

                    // Everything worked out so we can now redirect to
                    // the users state to view the data
                    if($rootScope.currentUser['role'] ==  0)
                        $state.go('home.pat');
                    else
                        $state.go('home.doc');
                });
            }

            $scope.signout = function(){
                $auth.logout().then(function(){
                    $state.go('login');
                    localStorage.removeItem('user');
                    $rootScope.authenticated = false;
                    $rootScope.currentUser = null;

                },function(e){
                    console.log(e);
                })
            }
           
        }]);