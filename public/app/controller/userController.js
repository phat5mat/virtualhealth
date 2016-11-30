/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('userController', ['$scope', '$location',
    '$http', 'userServices', 'specialityServices', 'doctorServices', '$state', '$auth', '$mdDialog',
    '$mdMedia', 'patientServices', '$rootScope', '$mdToast', '$timeout',
    '$filter','NgMap'
    , function ($scope, $location, $http, userServices, specialityServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter, NgMap) {

        
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;

        if($rootScope.currentUser){
            var currentUser = $rootScope.currentUser;
            var avatarPath = "assets/img/avatar-" + currentUser.username + ".jpg";
            var random = (new Date()).toString();
        }

        $scope.dateOptions = {
            maxDate: new Date(1995, 01, 01),
            minDate: new Date(1920, 01, 01),
            initDate: new Date(1995, 01, 01)
        };


        $scope.addSlide = function() {
            var position = slides.length + 1;
            slides.push({
                image: 'assets/img/Logo/' + position + '.jpg',
                text: ['Health Care Online',
                    'Verified Doctor',
                    'Get Doctor Note Online',
                    'Easy Management',
                'Friendly Schedule Management',
                'Easy Prescription Management',
                'Protect Your Smile',
                'Secure Your Health'][slides.length % 7],
                id: currIndex++
            });
        };

       $scope.loadGoogleMap = function(){
           NgMap.getMap().then(function(map) {
               console.log(map.getCenter());
               console.log('markers', map.markers);
               console.log('shapes', map.shapes);
           });
       }

        $scope.randomize = function() {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };

        for (var i = 0; i < 7; i++) {
            $scope.addSlide();
        }
        
        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }

        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }

        function shuffle(array) {
            var tmp, current, top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }

        $scope.loadUserDetails = function () {
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
            if($scope.userDetails.role == 1){
                $timeout(function(){
                    if($rootScope.docUser.doctor.status == 0)
                    {
                        $scope.statColor = 'alert alert-warning text-center';
                        $scope.statDetails = 'Pending';
                    }
                    if($rootScope.docUser.doctor.status == 1)
                    {
                        $scope.statColor = 'alert alert-success text-center';
                        $scope.statDetails = 'Active';
                    }
                    if($rootScope.docUser.doctor.status == 2)
                    {
                        $scope.statColor = 'alert alert-danger text-center';
                        $scope.statDetails = 'Rejected';
                    }
                });

            }
            if ($scope.userDetails.avatar == 0) {
                if($scope.userDetails.role == 1)
                    $scope.imgSrc = 'assets/img/no-avatarDoctor.png';
                else
                    $scope.imgSrc = 'assets/img/no-avatar.png';
                
            } else {
                $scope.imgSrc = avatarPath + "?cb=" + random;
            }
        };

        $scope.showUpdate = function () {
            $scope.updateToggle = true;
            $scope.changePasswordToggle = false;
            if($rootScope.patUser)
            {
                $scope.updateUser = {
                    updateName: $scope.userDetails.name,
                    username: $scope.userDetails.username,
                    email: $scope.userDetails.email,
                    phone: $scope.userDetails.phone,
                    dateofbirth: new Date($scope.userDetails.dateofbirth),
                    credit: $rootScope.patUser.credit_card,
                    insurance: $rootScope.patUser.health_insurance
                }
            }else{
                $scope.updateUser = {
                    updateName: $scope.userDetails.name,
                    username: $scope.userDetails.username,
                    email: $scope.userDetails.email,
                    phone: $scope.userDetails.phone,
                    dateofbirth: new Date($scope.userDetails.dateofbirth)
                }
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
                                    if($scope.userDetails.role == 0){
                                        patientServices.findByUser($scope.userDetails.id)
                                            .then(function(response){
                                                $rootScope.patUser.credit_card = response.data.credit_card;
                                                $rootScope.patUser.health_insurance = response.data.health_insurance;
                                            })
                                    }
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
                    $timeout(function () {
                        $scope.imgSrc = avatarPath + "?cb=" + random;
                    });

                }, function () {

                });
        };

        function changeAvatarDialogController($scope, $mdDialog, uploadServices) {
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.saveImage = function () {
                userServices.saveAvatar($scope.fileinfo)
                    .then(function (response) {
                        console.log(response);
                        $mdDialog.hide();
                    }, function (e) {
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


        resetForm = function () {
            $scope.user = {
                username: null,
                name: null,
                password: null,
                phone: null,
                email: null,
                certification: null,
                speciality: null,
                experience: null,
                dateofbirth: null,
                insurance: null, 
                credit: null
            };
            $scope.confirmpass = null;
        };

        $scope.showPatForm = function () {
            $timeout(function () {
                $scope.loading = true;
                resetForm();
                $scope.user.role = 0;
                $scope.patientForm.$setPristine();
                $scope.patientForm.$setUntouched();

            });
            $timeout(function(){
                $scope.patForm = true;
                $scope.selectRole = false;
                $scope.loading = false;
            },500)

        };


        $scope.showDocForm = function () {
            $timeout(function () {
                $scope.loading = true;
                resetForm();
                $scope.user.role = 1;
                $scope.doctorForm.$setPristine();
                $scope.doctorForm.$setUntouched();
                specialityServices.get().then(function (specData) {
                    $scope.specList = specData.data;
                }, function (e) {
                    console.log('get Speciality Error');
                });
            });

            $timeout(function(){
                $scope.docForm = true;
                $scope.selectRole = false;
                $scope.loading = false;
            },500)

        };


        $scope.backForm = function () {
            $scope.docForm = false;
            $scope.patForm = false;
            $scope.selectRole = true;
        };


        $scope.register = function () {
            $scope.loading = true;
            var dateFilter = $filter('date')($scope.user.dateofbirth, 'yyyy-MM-dd');
            $scope.user.dateofbirth = dateFilter;
            $scope.user.username = $scope.validatedUsername;
            $scope.user.email = $scope.validatedEmail;
            userServices.save($scope.user)
                .then(function (res) {
                    if($scope.user.role == 0){
                        $scope.patForm = false;
                        $scope.docForm = false;
                        $scope.loading = false;
                        $scope.successPatient = true;
                    }else{
                        userServices.saveZip($scope.fileinfo, res.data)
                            .then(function (response) {
                                $scope.validateUsername = true;
                                $scope.patForm = false;
                                $scope.docForm = false;
                                $scope.loading = false;
                                $scope.successDoctor = true;

                            }, function (e) {
                                console.log(e)
                            });
                    }

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

        $scope.dynamicPopover = {
            templateUrl: 'certificationQuestionTemplate.html'
        };

        $scope.loadDoctors = function () {
            $scope.loading = true;
            doctorServices.findByRequest()
                .then(function (response) {
                $scope.doctors = response.data;
                angular.forEach($scope.doctors,function(value, key){
                    if(value.avatar == 0)
                        value.avatarSrc = 'assets/img/no-avatarDoctor.png';
                    else
                        value.avatarSrc = "assets/img/avatar-"+value.username+".jpg?cb=" + random;

                    if($rootScope.currentUser)
                    {
                        if(currentUser.role == 2)
                        {
                            if (value.doctor.status == 0) {
                                value.doctor.status = 'Inactive';
                                value.doctor.statusColor = 'inactiveColor';
                            }
                            if (value.doctor.status == 1) {
                                value.doctor.status = 'Actived';
                                value.doctor.statusColor = 'activeColor';
                            }
                            if (value.doctor.status == 2) {
                                value.doctor.status = 'Rejected';
                                value.doctor.statusColor = 'rejectColor';
                            }
                        }
                    }

                    
                    specialityServices.getSpecialByDoctor(value.doctor.id)
                        .then(function(response){
                            value.speciality = response.data;
                        })
                });
                    $scope.loading = false;

                }, function (e) {
                console.log(e);
            })
        };
        
        $scope.showFeedback = function(){
            $timeout(function(){
                $scope.showfeed = true;
                $scope.showinformation = false;
                $scope.loadFeedback();
            })
        };

        $scope.loadFeedback = function(){
            doctorServices.getFeedback($rootScope.docUser.doctor.id)
                .then(function(response){
                    $timeout(function(){
                        $scope.feedbacks = response.data;
                        angular.forEach($scope.feedbacks,function(value,key){
                            value.date_issued = new Date(value.date_issued);
                        });
                    });
                })
        };

        $scope.getHighDoctor = function(){
            doctorServices.getHighDoctor()
                .then(function(response){
                    $timeout(function(){
                        $scope.highdoctor = response.data;
                        angular.forEach($scope.highdoctor,function(value, key){
                            value.user.doctor = value;
                            if(value.user.avatar == 1)
                            {
                                value.user.avatarSrc = "assets/img/avatar-" + value.user.username + ".jpg";
                            }else{
                                value.user.avatarSrc = "assets/img/no-avatarDoctor.png";

                            }
                            angular.forEach(value.feedback,function(value2,key2){
                                if(value2.comment != null)
                                {
                                    value.lastComment = '"'+value2.comment+'"';
                                }
                            })
                        });
                        console.log($scope.highdoctor)

                    });
                })
        };
        
        $scope.selectDoctor = function (doctor) {
            $state.go('room.viewDocRoom',{
                selectedDoc: doctor
            })
        };

        $scope.loadSpeciality = function (spec) {
            var specList = '';
            angular.forEach(spec, function (value, key) {
                specList = specList + value.speciality.name + ', ';
            });
            specList = specList.substring(0, specList.length - 2);
            return specList;
        };
        
    }]);





    

