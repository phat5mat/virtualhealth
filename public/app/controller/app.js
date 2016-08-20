/**
 * Created by REN on 7/25/2016.
 */


    'use strict';

    angular.module('authModule', ['ui.router', 'satellizer','ngMaterial','ui.bootstrap'])
        .config(function($stateProvider, $urlRouterProvider, $authProvider,$httpProvider, $provide) {

            function logoutRedirect($q,$injector){
                return {
                    responseError: function (reason) {

                        // because of using of these services inside the config so we need to
                        // inject it here in order to use it
                        var $state = $injector.get('$state');
                        var $rootScope = $injector.get('$rootScope');

                        // declare list of reasons that token can get
                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                        angular.forEach(rejectionReasons, function(value, key) {

                            if(reason.data.error === value) {

                                // if we get rejection by these reasons or any errors about users
                                // the user data will be remove from local storage and authenticated
                                // with current user are also set to null
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

                // redirect to user management page
                .state('users', {
                    url: '/users',
                    templateUrl: '../public/app/template/user/userView.html',
                    controller: 'userController'
                })

                //redirect to sign up page
                .state('signup',{
                    url: '/signup',
                    templateUrl: '../public/app/template/user/signup.html',
                    controller: 'userController'
            })

                // redirect to home page
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

                // redirect to doctor home page
                .state('home.doc',{
                    templateUrl: '../public/app/template/home.doc.html',
                })

                // redirect to patient home page
                .state('home.pat',{
                    templateUrl: '../public/app/template/home.pat.html',
                    controller: 'patientController',
                })

                // redirect to room list page
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
                                    $state.go('room.manageRoom');
                                });
                            }else {
                                $timeout(function() {
                                    $state.go('room.viewDocRoom');
                                });
                            }
                        }
                    }
                    
                })

                // redirect to selected doctor room list page
                .state('room.viewDocRoom',{
                    templateUrl: '../public/app/template/appointment/room.viewDocRoom.html',
                    controller: 'roomController',
                    params: {
                        selectedDoc: null
                    }

            })

                // redirect to doctor room management page
                .state('room.manageRoom',{
                    templateUrl: '../public/app/template/appointment/room.manageRoom.html',
                    controller: 'roomController',
                    params: {
                        selectedDoc: null
                    }

                })
                .state('appoint',{
                    templateUrl: '../public/app/template/appointment/appoint.html',
                    controller: 'roomController',
                    params: {
                        selectedDoc: null
                    },
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            return null;
                        }else{
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    $state.go('home.doc');
                                });
                            }else {
                                $timeout(function() {
                                    $state.go('appoint.manageAppointment');
                                });
                            }
                        }
                    }

                })
                .state('appoint.manageAppointment',{
                    templateUrl: '../public/app/template/appointment/appoint.manageAppointment.html',
                    params: {
                        selectedDoc: null
                    }

                })

                .state('manage',{
                    templateUrl: '../public/app/template/user/manage.html',
                    controller: 'userController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            return null;
                        }else{
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    $state.go('manage.doc');
                                });
                            }else {
                                $timeout(function() {
                                    $state.go('manage.pat');
                                });
                            }
                        }
                    }

                })

                .state('manage.pat',{
                    templateUrl: '../public/app/template/user/manage.pat.html',
                    controller: 'patientController'
                    
                })

                .state('manage.doc',{
                    templateUrl: '../public/app/template/user/manage.doc.html',
                    controller: 'doctorController'
                })

        })
        // auto execute this function after module get called
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

// define main application which contains all of services and modules.
angular.module('mainApp', ['authModule', 'userServices',
    'doctorServices','patientServices','facultyServices','roomServices','appointmentServices','ui.router']);



