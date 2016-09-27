/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
var compareTo = function() {
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
};
app.directive("compareTo", compareTo);

app.controller('patientController',['$scope','$location',
    '$http','userServices','facultyServices','doctorServices','$state','$auth','$mdDialog',
    '$mdMedia','patientServices','$rootScope','$mdToast','$timeout'
    ,function ($scope,$location,$http,userServices,facultyServices,doctorServices,$state,$auth,$mdDialog
    ,$mdMedia,patientServices,$rootScope,$mdToast,$timeout) {

        var currentUser = $rootScope.currentUser;
        $scope.loadPatientDetails = function(){
            $scope.patient = {
                name: null,
                email: null,
                phone: null,
                balance: null,
                dateofbirth: null
            };
           
            $scope.patient =  currentUser;
            $scope.patient.created_at = new Date($scope.patient.created_at);
            $scope.patient.updated_at = new Date($scope.patient.updated_at);

        };
        
        
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
        };

        $scope.showUpdate = function(){
            $scope.updateToggle = true;
            $scope.changePasswordToggle = false;
            $scope.updateUser = {
                updateName: currentUser.name,
                username: currentUser.username,
                email: currentUser.email,
                phone: currentUser.phone,
                dateofbirth: new Date(currentUser.dateofbirth)
            }
        };

        $scope.saveUpdate = function(){
            var confirm = $mdDialog.confirm()
                .title('Are you sure to save this information?')
                .textContent('Please choose your option.')
                .ok('Accept')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                userServices.update($rootScope.currentUser.id,$scope.updateUser)
                    .then(function(response){
                        $mdToast.show($mdToast.simple().textContent('Your information has been updated!!'));
                        userServices.findUserByID(currentUser.id)
                            .then(function(response){
                                $timeout(function(){
                                    $scope.patient = response.data[0];
                                    $scope.patient.created_at = new Date($scope.patient.created_at);
                                    $scope.patient.updated_at = new Date($scope.patient.updated_at);
                                    $scope.updateUser = null;
                                    $scope.updateToggle = false;
                                })
                            })
                    },function(e){
                        console.log(e)
                    })
            }, function() {

            });

        };
        
        $scope.showChangePassword = function(){
            $scope.changePasswordToggle = true;
            $scope.updateToggle = false;
        };
        

        $scope.updatePassword = function(){
            var passData = {
                user: currentUser.id,
                pass: $scope.oldpass
            };
            var newPassData = {
                user: currentUser.id,
                pass: $scope.newpass
            };
            userServices.validatePass(passData).
                then(function(response){
                if(response.data == "true"){
                    if($scope.oldpass == $scope.newpass)
                    {
                        $scope.wrongPass = true;
                        $scope.alertPass = 'The new password can not be match with old password'
                    }else{
                        $scope.wrongPass = false;
                        userServices.changePass(newPassData)
                            .then(function(response){
                                $scope.changePasswordToggle = false;
                                $mdToast.show($mdToast.simple().textContent('Your Password has been changed!! ' +
                                    'Please log in again'));
                                $rootScope.$emit("signOut", {});

                            },function(e){
                                console.log(e)
                            })
                    }
                }else{
                    $scope.alertPass = 'You have entered the wrong old password.'
                    $scope.wrongPass = true;
                }
            },function(e){
                console.log(e)
            })
        };

        
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





    

