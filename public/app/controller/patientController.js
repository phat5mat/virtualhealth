/**
 * Created by REN on 8/8/2016.
 */
/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');


app.controller('patientController', ['$scope', '$location',
    '$http', 'userServices', 'facultyServices', 'doctorServices', '$state', '$auth', '$mdDialog',
    '$mdMedia', 'patientServices', '$rootScope', '$mdToast', '$timeout', '$filter','Upload'
    , function ($scope, $location, $http, userServices, facultyServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter) {

        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username+".jpg";
        var random = (new Date()).toString();


        $scope.dateOptions = {
            maxDate: new Date(1995, 01, 01),
            minDate: new Date(1920, 01, 01)
        }
        $scope.loadPatientDetails = function () {
            $scope.patient = {
                name: null,
                email: null,
                phone: null,
                balance: null,
                dateofbirth: null,
                avatar: null
            };

            $scope.patient = currentUser;
            $scope.patient.dateofbirth = new Date($scope.patient.dateofbirth);
            $scope.patient.created_at = new Date($scope.patient.created_at);
            $scope.patient.updated_at = new Date($scope.patient.updated_at);
            console.log(currentUser);
            if($scope.patient.avatar == 0){
                $scope.imgSrc = 'assets/img/no-avatar.png';
            }else{
                $scope.imgSrc = avatarPath + "?cb=" + random;
            }

        };


        $scope.loadDoctors = function () {
            doctorServices.get().then(function (response) {
                $scope.doctors = response.data;
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

        $scope.showUpdate = function () {
            $scope.updateToggle = true;
            $scope.changePasswordToggle = false;
            $scope.updateUser = {
                updateName: $scope.patient.name,
                username: $scope.patient.username,
                email: $scope.patient.email,
                phone: $scope.patient.phone,
                dateofbirth: new Date($scope.patient.dateofbirth)
            }
        };

        $scope.saveUpdate = function () {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to save this information?')
                .textContent('Please choose your option.')
                .ok('Accept')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                var datefilter = $filter('date');
                var formattedDate = datefilter(new Date($scope.updateUser.dateofbirth), 'yyyy-MM-dd');
                $scope.updateUser.dateofbirth = formattedDate;
                userServices.update($rootScope.currentUser.id, $scope.updateUser)
                    .then(function (response) {
                        $mdToast.show($mdToast.simple().textContent('Your information has been updated!!'));
                        userServices.findUserByID(currentUser.id)
                            .then(function (response) {
                                $timeout(function () {
                                    localStorage.setItem('user', JSON.stringify(response.data));
                                    $scope.patient = response.data;
                                    $scope.patient.created_at = new Date($scope.patient.created_at);
                                    $scope.patient.updated_at = new Date($scope.patient.updated_at);
                                    $scope.updateToggle = false;
                                })
                            })
                    }, function (e) {
                        console.log(e)
                    })
            }, function () {

            });

        };

        $scope.showChangePassword = function () {
            $scope.changePasswordToggle = true;
            $scope.updateToggle = false;
        };


        $scope.updatePassword = function () {
            var passData = {
                user: currentUser.id,
                pass: $scope.oldpass
            };
            var newPassData = {
                user: currentUser.id,
                pass: $scope.newpass
            };
            userServices.validatePass(passData).then(function (response) {
                if (response.data == "true") {
                    if ($scope.oldpass == $scope.newpass) {
                        $scope.wrongPass = true;
                        $scope.alertPass = 'The new password can not be match with old password'
                    } else {
                        $scope.wrongPass = false;
                        userServices.changePass(newPassData)
                            .then(function (response) {
                                $scope.changePasswordToggle = false;
                                $mdToast.show($mdToast.simple().textContent('Your Password has been changed!! ' +
                                    'Please log in again'));
                                $rootScope.$emit("signOut", {});

                            }, function (e) {
                                console.log(e)
                            })
                    }
                } else {
                    $scope.alertPass = 'You have entered the wrong old password.'
                    $scope.wrongPass = true;
                }
            }, function (e) {
                console.log(e)
            })
        };

        $scope.datePicker = {
            opened: false
        };
        $scope.openDatePicker = function () {
            $scope.datePicker.opened = true;
        };

        $scope.showChangeAvatar = function () {
            $mdDialog.show({
                    controller: changeAvatarDialogController,
                    templateUrl: 'changeAvatarDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $timeout(function(){
                        $scope.imgSrc = $scope.imgSrc + "?cb=" + random;
                    });

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

        function changeAvatarDialogController($scope, $mdDialog, uploadServices) {
            $scope.cancel = function () {
                $mdDialog.cancel();
                
            };

            $scope.saveImage = function(){
                userServices.saveAvatar($scope.fileinfo)
                    .then(function(response){
                        console.log(response);
                        $mdDialog.hide();
                    },function(e){
                        console.log(e)
                    })
            }
            
        }

    }]);





    

