/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');


app.controller('patientController', ['$scope', '$location',
    '$http', 'userServices', 'facultyServices', 'doctorServices', '$state', '$auth', '$mdDialog',
    '$mdMedia', 'patientServices', '$rootScope', '$mdToast', '$timeout', 
    '$filter'
    , function ($scope, $location, $http, userServices, facultyServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter) {

        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username+".jpg";
        var random = (new Date()).toString();
        

        $scope.loadDoctors = function () {
            doctorServices.get().then(function (response) {
                $scope.doctors = response.data;
                angular.forEach($scope.doctors,function(value, key){
                    if(value.avatar == 0)
                        value.avatarSrc = 'assets/img/no-avatar.png';
                    else
                        value.avatarSrc = avatarPath + "?cb=" + random;
                })
            }, function (e) {
                console.log(e);
            })
        };


        $scope.selectDoctor = function (ev, doctor) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    locals: {passDoctor: doctor},
                    controller: viewDoctorDialogController,
                    templateUrl: 'viewDoctorDetailsDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen

                })
                .then(function (answer) {
                }, function () {
                });
        };
        

        function viewDoctorDialogController($scope, $mdDialog, $state, passDoctor) {
            // Dialog toggle
            $scope.doctorDetails = passDoctor;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.makeAppointment = function () {
                $mdDialog.cancel();
                $state.go('room.viewDocRoom', {selectedDoc: passDoctor});
            }
        }
        

    }]);





    

