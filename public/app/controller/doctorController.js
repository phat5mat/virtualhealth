var app = angular.module('mainApp');

app.controller('doctorController', ['$scope', '$http', '$window', 'doctorServices', '$mdToast', '$timeout', '$rootScope'
    , function ($scope, $http, $window, doctorServices, $mdToast, $timeout, $rootScope) {
        var upId = null;
        $scope.loading = true;
        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username + ".jpg";
        var random = (new Date()).toString();
        


        doctorServices.get()
            .success(function (docData) {
                $scope.doctors = docData;
                $scope.loading = false;
            });

        
        
        $scope.saveDoc = function () {
            $scope.loading = true;
            doctorServices.save($scope.doctor)
                .success(function (data) {

                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };


        $scope.removeDoc = function (id) {
            $scope.loading = true;
            doctorServices.destroy(id)
                .success(function (data) {
                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };


        $scope.updateDoc = function () {
            doctorServices.update(upId, $scope.doctor)
                .success(function (data) {
                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };


    }]);