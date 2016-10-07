/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('userController', ['$scope', '$location',
    '$http', 'userServices', 'facultyServices', 'doctorServices', '$state', '$auth', '$mdDialog',
    '$mdMedia', 'patientServices', '$rootScope', '$mdToast', '$timeout',
    '$filter'
    , function ($scope, $location, $http, userServices, facultyServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter){



        $scope.dateOptions = {
            maxDate: new Date(1995, 01, 01),
            minDate: new Date(1920, 01, 01)
        };
        
        $scope.loadUserDetails = function () {
            var currentUser = $rootScope.currentUser;
            var avatarPath = "assets/img/avatar-" + currentUser.username+".jpg";
            var random = (new Date()).toString();
            
            $scope.userDetails = {
                name: null,
                email: null,
                phone: null,
                balance: null,
                dateofbirth: null,
                avatar: null
            };

            $scope.userDetails = currentUser;
            $scope.userDetails.dateofbirth = new Date($scope.userDetails.dateofbirth);
            $scope.userDetails.created_at = new Date($scope.userDetails.created_at);
            $scope.userDetails.updated_at = new Date($scope.userDetails.updated_at);
            if($scope.userDetails.avatar == 0){
                $scope.imgSrc = 'assets/img/no-avatar.png';
            }else{
                $scope.imgSrc = avatarPath + "?cb=" + random;
            }
        };

        $scope.showUpdate = function () {
            $scope.updateToggle = true;
            $scope.changePasswordToggle = false;
            $scope.updateUser = {
                updateName: $scope.userDetails.name,
                username: $scope.userDetails.username,
                email: $scope.userDetails.email,
                phone: $scope.userDetails.phone,
                dateofbirth: new Date($scope.userDetails.dateofbirth)
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
                                    $scope.userDetails = response.data;
                                    $scope.userDetails.created_at = new Date($scope.userDetails.created_at);
                                    $scope.userDetails.updated_at = new Date($scope.userDetails.updated_at);
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


        $scope.loadUsers = function () {
            userServices.get()
                .then(function (userData) {
                        $scope.users = userData.data;
                        $scope.loading = false;
                    },
                    function (e) {
                        $scope.error = e;
                    })
        };


        $scope.signup = function () {
            $state.go('signup');
        };


        $scope.showPatForm = function () {
            $scope.patForm = true;
            $scope.selectRole = false;
        };


        $scope.showDocForm = function () {
            $scope.docForm = true;
            $scope.selectRole = false;
            facultyServices.get().then(function (facData) {
                $scope.facList = facData.data;
            }, function (e) {
                console.log('get Fac Error');
            });

        };


        $scope.backForm = function () {
            $scope.docForm = false;
            $scope.patForm = false;
            $scope.selectRole = true;
        };


        $scope.register = function () {
            $scope.loading = true;
            var dateFilter = $filter('date')($scope.user.dateinput, 'yyyy-MM-dd');
            $scope.user.dateofbirth = dateFilter;
            userServices.save($scope.user)
                .then(function (data) {
                        $scope.patForm = false;
                        $scope.docForm = false;
                        if ($scope.user.role == 0)
                            $scope.successPatient = true;
                        if ($scope.user.role == 1)
                            $scope.successDoctor = true;
                    },
                    function (e) {
                        console.log(e);
                    });
        };


        $scope.removeUser = function (id, role) {
            $scope.loading = true;
            userServices.destroy(id, role)
                .then(function (data) {
                        userServices.get()
                            .then(function (userData) {
                                $scope.users = userData.data;
                                $scope.loading = false;
                            }, function (e) {
                                console.log(e);
                            });
                    }
                    , function (e) {
                        console.log(e);
                    });
        };


        $scope.fillUserUpdate = function (upUser) {
            upId = upUser['docid'];
            $scope.user = {
                name: upUser['name'],
                password: upUser['password'],
                phone: upUser['phone'],
                email: upUser['email']
            }
        };

       

    }]);





    

