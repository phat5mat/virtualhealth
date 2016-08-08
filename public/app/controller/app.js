/**
 * Created by REN on 7/25/2016.
 */


    'use strict';

    angular.module('authModule', ['ui.router', 'satellizer','ngMaterial','ui.bootstrap'])
        .config(function($stateProvider, $urlRouterProvider, $authProvider,$httpProvider, $provide) {

            function logoutRedirect($q,$injector){
                return {
                    responseError: function (reason) {
                        var $state = $injector.get('$state');
                        var $rootScope = $injector.get('$rootScope');

                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                        angular.forEach(rejectionReasons, function(value, key) {

                            if(reason.data.error === value) {

                                // If we get a rejection corresponding to one of the reasons
                                // in our array, we know we need to authenticate the user so
                                // we can remove the current user from local storage
                                localStorage.removeItem('user');
                                localStorage.removeItem('docUser');
                                localStorage.removeItem('patUser');
                                $rootScope.authenticated = false;
                                $rootScope.currentUser = null;
                                // Send the user to the auth state so they can login
                                $state.go('login');
                            }
                        });

                        return $q.reject(reason);
                    }
                }
            }

            // Setup for the $httpInterceptor
            $provide.factory('logoutRedirect', logoutRedirect);

            // Push the new factory onto the $http interceptor array
            $httpProvider.interceptors.push('logoutRedirect');

            //Specify authentication address
            $authProvider.loginUrl = 'VirtualHealth/public/api/authenticate';

            // Redirect to the auth state if user request unspecified states
            $urlRouterProvider.otherwise('/home');

            // Display views for each specified state
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '../public/app/template/user/login.html',
                    controller: 'authController',
                    onEnter: function($rootScope,$state,$timeout){

                        if(localStorage.getItem('user') != null){
                            $timeout(function() {
                                $state.go('users');
                            });
                        }
                    }
                })
                .state('users', {
                    url: '/users',
                    templateUrl: '../public/app/template/user/userView.html',
                    controller: 'userController'
                })
                .state('signup',{
                    url: '/signup',
                    templateUrl: '../public/app/template/user/signup.html',
                    controller: 'userController'
            })
                .state('home',{
                    url: '/home',
                    templateUrl: '../public/app/template/home.html',
                    controller: 'userController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            return null;
                        }else{
                            if($rootScope.currentUser['role'] == 0){
                                $timeout(function() {
                                    $state.go('home.pat');
                                });
                            }else {
                                $timeout(function() {
                                    $state.go('home.doc');
                                });
                            }
                        }
                    }
                })
                .state('home.doc',{
                    templateUrl: '../public/app/template/home.doc.html',
                })
                .state('home.pat',{
                    templateUrl: '../public/app/template/home.pat.html',
                    controller: 'patientController',
                })
                .state('room',{
                    url: '/room',
                    templateUrl: '../public/app/template/appointment/room.html',
                    controller: 'roomController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            return null;
                        }else{
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    return null;
                                });
                            }else {
                                $timeout(function() {
                                    $state.go('home.pat');
                                });
                            }
                        }
                    }
                })
        })
        .run(function($rootScope){
            if(localStorage.getItem('satellizer_token')) {

                $rootScope.authenticated = true;
                $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
                var role = $rootScope.currentUser['role'];
                if(role == 0)
                    $rootScope.patUser = JSON.parse(localStorage.getItem('patUser'));
                if(role == 1)
                    $rootScope.docUser = JSON.parse(localStorage.getItem('docUser'));

            }
      
        });

angular.module('mainApp', ['authModule', 'userServices',
    'doctorServices','patientServices','facultyServices','roomServices','ui.router']);



