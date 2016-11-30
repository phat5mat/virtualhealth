/**
 * Created by REN on 7/25/2016.
 */


'use strict';

angular.module('authModule', ['ui.router', 'satellizer', 'ngMaterial'
        , 'ui.bootstrap', 'ngMessages', 'ngFileUpload','ngSanitize','chart.js','ds.clock','ngMap'])
    .config(function ($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide,$mdThemingProvider) {

        $mdThemingProvider
            .theme('default')
            .backgroundPalette('blue-grey');

        function logoutRedirect($q, $injector) {
            return {
                responseError: function (reason) {

                    // because of using of these services inside the config so we need to
                    // inject it here in order to use it
                    var $state = $injector.get('$state');
                    var $rootScope = $injector.get('$rootScope');
                    var $mdToast = $injector.get('$mdToast');


                    // declare list of reasons that token can get
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    angular.forEach(rejectionReasons, function (value, key) {

                        if (reason.data.error === value) {

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
                onEnter: function ($rootScope, $state, $timeout) {

                    if (localStorage.getItem('user') != null) {
                        $timeout(function () {
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
            .state('signup', {
                url: '/signup',
                templateUrl: '../public/app/template/user/signup.html',
                controller: 'userController'
            })

            // redirect to home page
            .state('home', {
                url: '/home',
                templateUrl: '../public/app/template/home.html',
                controller: 'userController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        return null;
                    } else {
                        if ($rootScope.currentUser['role'] == 0) {
                            $timeout(function () {
                                $state.go('home.pat');
                            });
                        }
                        if ($rootScope.currentUser['role'] == 1) {
                            $timeout(function () {
                                $state.go('home.doc');
                            });
                        }
                        if ($rootScope.currentUser['role'] == 2) {
                            $timeout(function () {
                                $state.go('home.staff');
                            });
                        }
                    }
                }
            })

            // redirect to doctor home page
            .state('home.doc', {
                templateUrl: '../public/app/template/home.doc.html',
                controller: 'doctorController'

            })

            // redirect to patient home page
            .state('home.pat', {
                templateUrl: '../public/app/template/home.pat.html',
                controller: 'patientController'
            })

            .state('home.staff', {
                templateUrl: '../public/app/template/home.staff.html',
                controller: 'staffController'
            })

            // redirect to room list page
            .state('room', {
                url: '/room',
                templateUrl: '../public/app/template/appointment/room.html',
                controller: 'roomController'

            })

            // redirect to selected doctor room list page
            .state('room.viewDocRoom', {
                url: '/viewRoom',
                templateUrl: '../public/app/template/appointment/room.viewDocRoom.html',
                controller: 'roomController',
                params: {
                    selectedDoc: null
                }

            })

            // redirect to doctor room management page
            .state('room.manageRoom', {
                url: '/manageRoom',
                templateUrl: '../public/app/template/appointment/room.manageRoom.html',
                controller: 'roomController',
                onEnter: function ($rootScope, $state, $timeout,$mdToast) {
                    if ($rootScope.currentUser == null) {
                            $state.go('login');
                    }else{
                        if ($rootScope.currentUser['role'] == 0) {
                            $timeout(function () {
                                $state.go('home.pat');
                            });
                        }
                        if($rootScope.currentUser['role'] == 1){
                            if($rootScope.docUser.doctor.status == 1)
                            {
                                $timeout(function(){
                                    $state.go('room.manageRoom');
                                })
                            }else{
                                $timeout(function(){
                                    $state.go('home');
                                    $mdToast.show($mdToast.simple().textContent('You need to be activated to use this function!'));
                                })
                            }
                        }
                    }
                }

            })

            .state('exam', {
                url: '/exam',
                templateUrl: '../public/app/template/examination/exam.html',
                controller: 'examController',
                params: {
                    selectedRoom: null,
                    selectedAppoint: null
                },
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }

            })

            .state('appoint', {
                url: '/appointment',
                templateUrl: '../public/app/template/appointment/appoint.html',
                controller: 'roomController',
                params: {
                    selectedRoom: null
                },
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    } else {
                        if ($rootScope.currentUser['role'] == 1) {
                            $timeout(function () {
                                $state.go('home.doc');
                            });
                        }
                        if ($rootScope.currentUser['role'] == 0) {
                            $timeout(function () {
                                $state.go('appoint.manageAppointment');
                            });
                        }
                        if ($rootScope.currentUser['role'] == 2) {
                            $timeout(function () {
                                $state.go('home.staff');
                            });
                        }
                    }
                }

            })
            .state('appoint.manageAppointment', {
                url: '/manageAppointment',
                templateUrl: '../public/app/template/appointment/appoint.manageAppointment.html',
                params: {
                    selectedRoom: null
                }
            })

            .state('manage', {
                url: '/manageAccount',
                templateUrl: '../public/app/template/user/manage.html',
                controller: 'userController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }

            })


            .state('viewRequest', {
                url: '/viewRequest',
                templateUrl: '../public/app/template/user/viewRequest.html',
                controller: 'staffController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }

            })

            .state('reviewDoctor', {
                url: '/requestDetails',
                templateUrl: '../public/app/template/user/reviewDoctor.html',
                controller: 'staffController',
                params: {
                    doctor: null
                },
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }
            })

            .state('examList', {
                url: '/manageExam',
                templateUrl: '../public/app/template/examination/examList.html',
                controller: 'manageExamController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }
            })

            .state('examDetails', {
                templateUrl: '../public/app/template/examination/examDetails.html',
                controller: 'manageExamController',
                params: {
                    selectedExam: null
                },
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }
            })

            .state('viewPatient', {
                url: '/viewPatient',
                templateUrl: '../public/app/template/user/viewPatient.html',
                controller: 'doctorController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }
            })

            .state('viewAppointment', {
                url: '/viewAppointment',
                templateUrl: '../public/app/template/appointment/viewAppointment.html',
                controller: 'roomController',
                onEnter: function ($rootScope, $state, $timeout) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                }
            })

            .state('viewExamination', {
                url: '/viewExamination',
                templateUrl: '../public/app/template/examination/viewExamination.html',
                controller: 'manageExamController',
                onEnter: function ($rootScope, $state, $timeout,$mdToast) {
                    if ($rootScope.currentUser == null) {
                        $state.go('login');
                    }
                    if($rootScope.currentUser['role'] == 1){
                        if($rootScope.docUser.doctor.status == 1)
                        {
                            $timeout(function(){
                                $state.go('viewExamination');
                            })
                        }else{
                            $timeout(function(){
                                $state.go('home');
                                $mdToast.show($mdToast.simple().textContent('You need to be activated to use this function!'));
                            })
                        }
                    }
                }
            })

            .state('viewDoctor', {
                url: '/viewDoctor',
                templateUrl: '../public/app/template/user/viewDoctor.html',
                controller: 'userController'
            })



    })
    // auto execute this function after module get called
    .run(function ($rootScope) {
        if (localStorage.getItem('satellizer_token')) {

            $rootScope.authenticated = true;
            $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
            var role = $rootScope.currentUser['role'];
            if (role == 0)
                $rootScope.patUser = JSON.parse(localStorage.getItem('patUser'));
            if (role == 1)
                $rootScope.docUser = JSON.parse(localStorage.getItem('docUser'));
            if (role == 2)
                $rootScope.staffUser = JSON.parse(localStorage.getItem('staffUser'));

        }


    });

// define main application which contains all of services and modules.
var app = angular.module('mainApp', ['authModule', 'ui.router', 'smart-table', 'ui.footable', 'wt.responsive']);


app.directive("confirmPass", function () {
    return {
        require: "ngModel",
        scope: {
            password: "=confirmPass"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.confirmPass = function (modelValue) {
                return modelValue == scope.password;
            };

            scope.$watch("password", function () {
                ngModel.$validate();
            });
        }
    };
});

app.directive('usernameAvailable', function ($timeout, $q, userServices) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            validatedUsername: '='
        },
        link: function (scope, elm, attr, model) {
            model.$asyncValidators.usernameAvailable = function () {
                var defer = $q.defer();
                userServices.checkUsername(model.$viewValue)
                    .then(function (res) {
                        if (res.data == "true") {
                            $timeout(function () {
                                model.$setValidity('usernameAvailable', true);
                                scope.validatedUsername = model.$viewValue;
                                defer.resolve;
                            });
                        }
                        else {
                            $timeout(function () {
                                model.$setValidity('usernameAvailable', false);
                                defer.resolve;
                            })
                        }
                    });


                return defer.promise;
            };
        }
    }
});

app.directive('emailAvailable', function ($timeout, $q, userServices) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            validatedEmail: '='
        },
        link: function (scope, elm, attr, model) {
            model.$asyncValidators.emailAvailable = function () {
                var defer = $q.defer();
                userServices.checkEmail(model.$viewValue)
                    .then(function (res) {
                        if (res.data == "true") {
                            $timeout(function () {
                                model.$setValidity('emailAvailable', true);
                                scope.validatedEmail = model.$viewValue;
                                defer.resolve;
                            });
                        }
                        else {
                            $timeout(function () {
                                model.$setValidity('emailAvailable', false);
                                defer.resolve;
                            })
                        }
                    });


                return defer.promise;
            };
        }
    }
});


app.directive("ngFileSelect", function (uploadServices, $timeout) {

    return {
        scope: {
            imgRead: '=',
            imgFile: '=',
            validateSize: '=',
            zipFile: '=',
            zipRead: '=',
            wrongFile: '='
        },
        link: function ($scope, selectedFile, $attr) {
            function getFileImage(file) {
                if (file.size > 1000000) {
                    $timeout(function () {
                        $scope.validateSize = false;
                    });
                } else {
                    uploadServices.readAsDataUrl(file, $scope)
                        .then(function (result) {
                            $timeout(function () {
                                $scope.validateSize = true;
                                $scope.imgRead = result;
                                $scope.imgFile = file;
                                $scope.wrongFile = true;
                                var sizeKB = file.size / 1000;
                                $scope.imgFile.sizeOutput = sizeKB.toFixed(2) + 'KB (' + file.size + '  bytes)';
                            });
                        });
                }
            }

            function getFileZip(file) {
                if (file.size > 5000000) {
                    $timeout(function () {
                        $scope.validateSize = false;
                        $scope.wrongFile = true;
                    });
                } else {
                    $timeout(function () {
                        $scope.validateSize = true;
                        $scope.zipFile = file;
                        $scope.zipRead = true;
                        $scope.wrongFile = true;
                        var sizeKB = file.size / 1000;
                        if (sizeKB > 1000) {
                            var sizeMB = sizeKB / 1000;
                            $scope.zipFile.sizeOutput = sizeMB.toFixed(2) + 'MB (' + file.size + '  bytes)';
                        } else {
                            $scope.zipFile.sizeOutput = sizeKB.toFixed(2) + 'KB (' + file.size + '  bytes)';
                        }
                    });

                }
            }
            
            function getFileError(){
                $timeout(function(){
                    $scope.validateSize = true;
                    $scope.wrongFile = false;
                });

            }

            selectedFile.bind("change", function (e) {
                var file = e.target.files[0];
                if (file) {
                    var fileTypeZip = file.name.split(".");
                    var fileTypeImage = file.type.split("/");
                }
                if (fileTypeZip[fileTypeZip.length - 1] == 'zip')
                    getFileZip(file);
                else {
                    if (fileTypeImage[0] == 'image')
                        getFileImage(file);
                    else 
                        getFileError();
                }
                
            });

        }
    }

});

app.directive('pageSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
});


app.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
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
                canvas.attr({width: width, height: height});
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);