/**
 * Created by REN on 7/25/2016.
 */


    'use strict';

    angular.module('authModule', ['ui.router', 'satellizer','ngMaterial'
        ,'ui.bootstrap','ngMessages','ngFileUpload'])
        .config(function($stateProvider, $urlRouterProvider, $authProvider,$httpProvider, $provide) {


            function logoutRedirect($q,$injector){
                return {
                    responseError: function (reason) {

                        // because of using of these services inside the config so we need to
                        // inject it here in order to use it
                        var $state = $injector.get('$state');
                        var $rootScope = $injector.get('$rootScope');
                        var $mdToast = $injector.get('$mdToast');



                        // declare list of reasons that token can get
                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                        angular.forEach(rejectionReasons, function(value, key) {

                            if(reason.data.error === value) {

                                // if we get rejection by these reasons or any errors about users
                                // the user data will be remove from local storage and authenticated
                                // with current user are also set to null
                                localStorage.clear();
                                $rootScope.authenticated = false;
                                $rootScope.currentUser = null;
                                $rootScope.patUser = null;
                                $rootScope.docUser = null;
                                $mdToast.show($mdToast.simple().textContent('Your authentication has been expired.Please login again!!!'));
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
                    templateUrl: '../public/app/template/user/viewUser.html',
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
                            }
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    $state.go('home.doc');
                                });
                            }
                            if($rootScope.currentUser['role'] == 2){
                                $timeout(function() {
                                    $state.go('home.staff');
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

                .state('home.staff',{
                    templateUrl: '../public/app/template/home.staff.html',
                    controller: 'staffController',
                })

                // redirect to room list page
                .state('room',{
                    url: '/room',
                    templateUrl: '../public/app/template/appointment/room.html',
                    controller: 'roomController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            $state.go('login');
                        }else{
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    $state.go('room.manageRoom');
                                });
                            }
                            if($rootScope.currentUser['role'] == 2){
                                $timeout(function() {
                                    $state.go('home.staff');
                                });
                            }
                            
                        }
                    }
                    
                })

                // redirect to selected doctor room list page
                .state('room.viewDocRoom',{
                    url: '/viewRoom',
                    templateUrl: '../public/app/template/appointment/room.viewDocRoom.html',
                    controller: 'roomController',
                    params: {
                        selectedDoc: null
                    }

            })

                // redirect to doctor room management page
                .state('room.manageRoom',{
                    url: '/manageRoom',
                    templateUrl: '../public/app/template/appointment/room.manageRoom.html',
                    controller: 'roomController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser['role'] == 0){
                            $timeout(function() {
                                $state.go('home.pat');
                            });
                        }
                    }

                })
                
                .state('exam',{
                    url: '/exam',
                    templateUrl: '../public/app/template/examination/exam.html',
                    controller: 'examController',
                    params: {
                        selectedRoom: null,
                        selectedAppoint: null
                    },

                })

                .state('appoint',{
                    url: '/appointment',
                    templateUrl: '../public/app/template/appointment/appoint.html',
                    controller: 'roomController',
                    params: {
                        selectedRoom: null
                    },
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            $state.go('login');
                        }else{
                            if($rootScope.currentUser['role'] == 1){
                                $timeout(function() {
                                    $state.go('home.doc');
                                });
                            }
                            if($rootScope.currentUser['role'] == 0){
                                $timeout(function() {
                                    $state.go('appoint.manageAppointment');
                                });
                            }
                            if($rootScope.currentUser['role'] == 2){
                                $timeout(function() {
                                    $state.go('home.staff');
                                });
                            }
                        }
                    }

                })
                .state('appoint.manageAppointment',{
                    url: '/manageAppointment',
                    templateUrl: '../public/app/template/appointment/appoint.manageAppointment.html',
                    params: {
                        selectedRoom: null
                    },
                })

                .state('manage',{
                    url: '/manageAccount',
                    templateUrl: '../public/app/template/user/manage.html',
                    controller: 'userController',
                    onEnter: function($rootScope,$state,$timeout){
                        if($rootScope.currentUser == null){
                            $state.go('login');
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
                
                
                .state('viewRequest',{
                    url: '/viewRequest',
                    templateUrl: '../public/app/template/user/viewRequest.html',
                    controller: 'staffController'
                   
                })

                .state('reviewDoctor',{
                    url: '/requestDetails',
                    templateUrl: '../public/app/template/user/reviewDoctor.html',
                    controller: 'staffController',
                    params: {
                        doctor: null
                    }
                })

                .state('examList',{
                    url: '/manageExam',
                    templateUrl: '../public/app/template/examination/examList.html',
                    controller: 'manageExamController'
                })

                .state('examDetails',{
                    templateUrl: '../public/app/template/examination/examDetails.html',
                    controller: 'manageExamController',
                    params: {
                        selectedExam: null
                    }
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
                if(role == 2)
                    $rootScope.staffUser = JSON.parse(localStorage.getItem('staffUser'));

            }
            
      
        });

// define main application which contains all of services and modules.
var app = angular.module('mainApp', ['authModule','ui.router']);


app.directive("compareTo", function(){
    return {
        require: "ngModel",
        scope: {
            otherValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherValue;
            };

            scope.$watch("otherValue", function() {
                ngModel.$validate();
            });
        }
    };
});


app.directive("ngFileSelect", function (uploadServices,$timeout) {

    return {
        scope: {
            imgRead: '=',
            imgFile: '=',
            validateSize: '='
        },
        link: function ($scope, selectedFile,$attr) {
            function getFile(file) {
                if(file.size > 1000000){
                    $timeout(function(){
                        $scope.validateSize = false;
                    });
                }else{
                    uploadServices.readAsDataUrl(file, $scope)
                        .then(function(result) {
                            $timeout(function() {
                                $scope.validateSize = true;
                                $scope.imgRead = result;
                                $scope.imgFile = file;
                                var sizeKB = file.size/1000;
                                $scope.imgFile.sizeOutput = sizeKB + 'KB (' + file.size + '  bytes)';
                            });
                        });
                }
            }

            selectedFile.bind("change", function (e) {
                var file = e.target.files[0];
                if(file)    
                getFile(file);
                
            });

        }
    }

});

app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);