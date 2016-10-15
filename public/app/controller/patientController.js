/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');


app.controller('patientController', ['$scope', '$location',
    '$http', 'userServices', 'specialityServices', 'doctorServices', '$state', '$auth', '$mdDialog',
    '$mdMedia', 'patientServices', '$rootScope', '$mdToast', '$timeout',    
    '$filter'
    , function ($scope, $location, $http, userServices, specialityServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter) {

        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username+".jpg";
        var random = (new Date()).toString();
        

        $scope.loadDoctors = function () {
            doctorServices.get().then(function (response) {
                $scope.doctors = response.data;
                angular.forEach($scope.doctors,function(value, key){
                    if(value.avatar == 0)
                        value.avatarSrc = 'assets/img/no-avatarDoctor.png';
                    else
                        value.avatarSrc = "assets/img/avatar-"+value.username+".jpg?cb=" + random;
                    specialityServices.getSpecialByDoctor(value.doctor.id)
                        .then(function(response){
                            value.speciality = response.data;
                        })
                })
            }, function (e) {
                console.log(e);
            })
        };

        $scope.loadSpeciality = function(spec){
            var specList = '';
          angular.forEach(spec,function(value, key){
              specList = specList + value.speciality.name + ', ';
          });
            specList = specList.substring(0,specList.length-2);
            return specList;
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

            $scope.loadSpeciality = function(spec){
                var specList = '';
                angular.forEach(spec,function(value, key){
                    specList = specList + value.speciality.name + ', ';
                });
                specList = specList.substring(0,specList.length-2);
                return specList;
            };

            $scope.makeAppointment = function () {
                $mdDialog.cancel();
                $state.go('room.viewDocRoom', {selectedDoc: passDoctor});
            }
        }
        

    }]);





    

