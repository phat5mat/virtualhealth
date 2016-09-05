/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('patientController',['$scope','$location',
    '$http','userServices','facultyServices','doctorServices','$state','$auth','$mdDialog',
    '$mdMedia','patientServices','$rootScope',
    function ($scope,$location,$http,userServices,facultyServices,doctorServices,$state,$auth,$mdDialog
    ,$mdMedia,patientServices,$rootScope) {

        $scope.patientDetails = function(){
            $scope.patient = {
                name: null,
                email: null,
                phone: null,
                balance: null,
                dateofbirth: null
            }

            var user = JSON.parse(localStorage.getItem('user'));
            $scope.patient.name = user['name'];
            $scope.patient.email = user['email'];
            $scope.patient.phone = user['phone'];
            $scope.patient.balance = user['balance'];
            $scope.patient.dateofbirth = user['dateofbirth'];

        }
        
        
        $scope.loadDoctors = function(){
            doctorServices.get().
                then(function(response){
               $scope.doctors = response.data;
            },function(e){
                console.log(e);
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
                });
        }

        
        function viewDoctorDialogController($scope,$mdDialog,$state,passDoctor){
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





    

