/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var userApp = angular.module('mainApp');
userApp.controller('patientController',['$scope','$location',
    '$http','userServices','facultyServices','doctorServices','$state','$auth','$mdDialog',
    '$mdMedia',
    function ($scope,$location,$http,userServices,facultyServices,doctorServices,$state,$auth,$mdDialog
    ,$mdMedia) {

        $scope.loadDoctors = function(){
            doctorServices.get().
                then(function(response){
               $scope.doctors = response.data;
            },function(e){
                console.log(e.data.error);
            })
        };

        $scope.selectDoctor = function(ev,doctor) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
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
                })
                .finally(function(){
                    $scope.loadRoom();
                });
        }

        function viewDoctorDialogController($scope,$mdDialog,$state,$rootScope,passDoctor){
            // Dialog toggle
            $scope.doctorDetails = passDoctor;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.makeAppointment = function(){
                $mdDialog.cancel();
                $state.go('room.viewDocRoom',{selectedDoc: passDoctor});
            }
        }

    }]);





    

