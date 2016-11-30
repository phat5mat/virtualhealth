/**
 * Created by REN on 8/5/2016.
 */
var app = angular.module('mainApp');
app.controller('roomController', ['$scope', '$mdDialog', 'roomServices', '$mdMedia', '$state', '$stateParams',
    'appointmentServices', '$rootScope', '$mdToast', 'patientServices', 'specialityServices', '$timeout',
    function ($scope, $mdDialog, roomServices, $mdMedia, $state, $stateParams,
              appointmentServices, $rootScope, $mdToast, specialityServices
        , patientServices, $timeout) {

        $scope.loading = true;
        var currentUser = JSON.parse(localStorage.getItem('user'));
        $scope.appointDocList = [];


        var handleStatusColor = function (data) {
            $scope.rooms = data;
            $scope.loading = false;
            angular.forEach($scope.rooms, function (value, key) {
                value.startDate = new Date(value.startDate);
                if (value.status == 0) {
                    value.status = 'Waiting';
                    value.statusColor = 'waitingColor';
                }
                if (value.status == 1) {
                    value.status = 'Open';
                    value.statusColor = 'startingColor';
                }
                if (value.status == 2) {
                    value.status = 'Closed';
                    value.statusColor = 'canceledColor';
                }

            })
        };

        // Load all room
        $scope.loadRoom = function () {
            try {
                roomServices.findroombydoctor($rootScope.docUser.doctor.id)
                    .then(function (roomData) {

                        if(roomData.data.length == 0){
                            $scope.roomNum = 0;
                        }else{
                            $scope.roomNum = 1;
                            angular.forEach(roomData.data, function (value, key) {
                                if (value.status == 0) {
                                    var today = new Date();
                                    var roomDate = new Date(value.startDate);
                                    if (today.setHours(0, 0, 0, 0) > roomDate.setHours(0, 0, 0, 0)) {
                                        roomServices.updateStatus(value.id, 2)
                                            .then(function () {
                                                appointmentServices.updateAppointmentStatusExpired(value.id, 3)
                                                    .then(function () {
                                                        $mdToast.show($mdToast.simple().textContent(value.name +
                                                            ' Room has been closed due to expired date'));
                                                        roomServices.findroombydoctor($rootScope.docUser.doctor.id)
                                                            .then(function (response) {
                                                                handleStatusColor(response.data);
                                                            })
                                                    })
                                            })
                                    }
                                }
                            });
                            handleStatusColor(roomData.data);
                        }

                        },
                        function (e) {
                            $scope.error = e;
                        })
            }
            catch (e) {
                console.log(e);
            }


        };

        // Load selected doctor's room list
        $scope.loadRoombyDoctor = function () {
            $scope.doctorDetails = $stateParams.selectedDoc;
            try {
                
                $selectedDoc = $stateParams.selectedDoc.doctor;
                roomServices.findroombydoctor($selectedDoc['id'])
                    .then(function (roomData) {
                            handleStatusColor(roomData.data);
                        },
                        function (e) {
                            console.log(e)
                        })
            }
            catch (e) {
                // go to home page when error occur or user refresh the page
                $state.go('viewDoctor');

            }

        };

        $scope.loadSpeciality = function (spec) {
            console.log(spec)
            var specList = '';
            angular.forEach(spec, function (value, key) {
                specList = specList + value.speciality.name + ', ';
            });
            specList = specList.substring(0, specList.length - 2);
            return specList;
        };

        $scope.closeRoom = function (room) {
            var confirm = $mdDialog.confirm()
                .title('Do you want to close ' + room.name + ' room?')
                .textContent('Please choose your option.')
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                roomServices.updateStatus(room.id, 3)
                    .then(function () {
                        room.status = 'Closed';
                        room.statusColor = 'canceledColor';
                        $mdToast.show($mdToast.simple().textContent(room.name + ' Room has been closed!!'));
                    })
            });
        };

        $scope.cancelAppoint = function (appoint) {
            var confirm = $mdDialog.confirm()
                .title('Do you want to cancel appointment with ' + appoint.room.name + ' Room?')
                .textContent('Please choose your option.')
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                appointmentServices.updateStatusIndividual(appoint.id, 3)
                    .then(function () {
                        appoint.status = 'Canceled';
                        appoint.statusColor = 'canceledColor';
                        $mdToast.show('Appointment with ' + appoint.room.name + ' has been canceled!!!');
                    })
            });
        };


        $scope.loadAppointment = function () {
            try {
                appointmentServices.patientappoint($rootScope.patUser['id'])
                    .then(function (appointData) {
                            $scope.appointments = appointData.data;
                        if($scope.appointments.length == 0){
                            $scope.noAppoint = true;
                            $scope.loading = false;
                        }else{
                            $scope.noAppoint = false;
                            angular.forEach($scope.appointments, function (value, key) {
                                value.room.startDate = new Date(value.room.startDate);
                                if (value.status == 0) {
                                    value.status = 'Waiting';
                                    value.statusColor = 'waitingColor';
                                }
                                if (value.status == 1) {
                                    value.status = 'Open';
                                    value.statusColor = 'startingColor';
                                }
                                if (value.status == 2) {
                                    value.status = 'Finished';
                                    value.statusColor = 'finishedColor';
                                }
                                if (value.status == 3) {
                                    value.status = 'Canceled';
                                    value.statusColor = 'canceledColor';
                                }

                            });
                            $scope.loading = false;
                        }
                        },
                        function (e) {
                            console.log(e.data.error);
                        })
            }
            catch (e) {
                // go to home page when error occur or user refresh the page
                $state.go('home.pat');
            }
        };

        // Show Create new Room dialog
        $scope.showCreateRoomDialog = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                    controller: createRoomController,
                    templateUrl: 'createRoomDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen

                })
                .then(function (answer) {
                }, function () {
                    $scope.loadRoom();
                })

        };


        $scope.showMakeAppointmentDialog = function (ev, room) {
            if(!$rootScope.currentUser)
            {
                $mdToast.show($mdToast.simple().textContent('You have to logged in for making an appointment!'));
            }
            if(room.status == 'Waiting' || room.status == 'Open'){
                var checkExistData = {
                    room: room.id,
                    patient: $rootScope.patUser['id']
                };
                appointmentServices.checkExist(checkExistData)
                    .then(function(response){
                        if(response.data == 'false')
                        {
                            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

                            $mdDialog.show({
                                    locals: {passRoom: room},
                                    controller: makeAppointmentController,
                                    templateUrl: 'makeAppointmentDialog.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose: true,
                                    fullscreen: useFullScreen

                                })
                                .then(function (answer) {
                                }, function () {
                                });
                        }else{
                            $mdToast.show($mdToast.simple().textContent('You have made appointment with this room already!'));
                        }
                    })

            }else{
                $mdToast.show($mdToast.simple().textContent('This room is not availabled!'));
            }

        };

        // remove room
        $scope.removeRoom = function (id) {
            $scope.loading = true;
            roomServices.destroy(id)
                .success(function (data) {
                    roomServices.get()
                        .success(function (roomData) {
                            $scope.rooms = roomData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };

        // redirect to selected room details page
        $scope.selectRoom = function (room, appointID) {
            var currentDate = new Date();
            var enterRoom = function () {
                $state.go('exam', {
                    selectedRoom: room,
                    selectedAppoint: appointID
                })
            };

            if (currentUser.role == 1 && room.status == 'Waiting') {
                if (currentDate < room.startDate) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Open time has not come yet')
                            .textContent('Please wait until start date to open the room.')
                            .ok('OK')
                    );
                } else {
                    var confirm = $mdDialog.confirm()
                        .title('Do you want to open the room?')
                        .textContent('Please choose your option.')
                        .ok('YES')
                        .cancel('BACK');

                    $mdDialog.show(confirm).then(function () {
                        if(localStorage.getItem('chatRoom'))
                        {
                            $mdToast.show($mdToast.simple().textContent('You cannot open two rooms at the same time!'));
                        }else{
                            roomServices.updateStatus(room.id, 1)
                                .then(function (response) {
                                    appointmentServices.updateStatus(room.id, 1)
                                        .then(function () {
                                            enterRoom();
                                        });
                                })
                        }
                    });
                }

            }
            if (currentUser.role == 1 && room.status == 'Open') {
                enterRoom();
            }

        };

        $scope.selectAppoint = function (appoint) {
            if (currentUser.role == 0 && appoint.status == 'Open') {
                $state.go('exam', {
                    selectedRoom: appoint.room,
                    selectedAppoint: appoint.id
                });
            }
        };

        $scope.loadAppointmentByDoc = function () {
            try {
                appointmentServices.doctorappoint2($rootScope.docUser.doctor.id)
                    .then(function (response) {
                            var data = response.data;
                            angular.forEach(data, function (value, key) {
                                if (value.appointment.length > 1) {
                                    angular.forEach(value.appointment, function (value2, key2) {
                                        value2.room = value;
                                        $scope.appointDocList.push(value2);
                                    })
                                }
                                if (value.appointment.length == 1) {
                                    value.appointment[0].room = value;
                                    $scope.appointDocList.push(value.appointment[0]);
                                }
                            });

                            angular.forEach($scope.appointDocList, function (value, key) {
                                value.room.startDate = new Date(value.room.startDate);
                                if (value.status == 0) {
                                    value.status = 'Waiting';
                                    value.statusColor = 'waitingColor';
                                }
                                if (value.status == 1) {
                                    value.status = 'Open';
                                    value.statusColor = 'startingColor';
                                }
                                if (value.status == 2) {
                                    value.status = 'Canceled';
                                    value.statusColor = 'canceledColor';
                                }
                             

                            });
                            $scope.loading = false;
                        },
                        function (e) {
                            console.log(e.data.error);
                        })
            }
            catch (e) {
                // go to home page when error occur or user refresh the page
                $state.go('home.pat');
            }
        };

        $scope.selectPatient = function (pat) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                    locals: {passRoom: room},
                    controller: makeAppointmentController,
                    templateUrl: 'makeAppointmentDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen

                })
                .then(function (answer) {
                }, function () {
                });
        };

        // Controller of create room dialog
        function createRoomController($scope, $mdDialog, $rootScope, $filter, specialityServices) {
            // Dialog toggle
            $scope.dateOptions = {
                minDate: new Date()
            };

            $scope.open1 = function () {
                $scope.startDatePicker.opened = true;
            };
            $scope.startDatePicker = {
                opened: false
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            //Initialize date object
            $scope.startDateobj = new Date();

            specialityServices.getSpecialByDoctor($rootScope.docUser.doctor.id)
                .then(function (response) {
                    $scope.specList = response.data;
                });

            $scope.createRoom = function () {
                // Get time from timepicker and set to startDate object
                var startH = $scope.startTime.getHours();
                var startM = $scope.startTime.getMinutes();
                $scope.room.startDateobj.setHours(startH);
                $scope.room.startDateobj.setMinutes(startM);
                var datefilter = $filter('date');
                var formattedDate = datefilter($scope.room.startDateobj, 'yyyy-MM-dd HH:mm:ss');
                $scope.room.startDate = formattedDate;

                // Get doctor's id
                $scope.room.doctor = $rootScope.docUser.doctor.id;

                // Save room into database
                roomServices.save($scope.room)
                    .then(function () {
                        $mdToast.show($mdToast.simple().textContent('Room is created successful!'));
                        $mdDialog.cancel();
                    }, function (e) {
                        console.log(e.data.error);
                    })

            }
        }

        // make appointment dialog controller 
        function makeAppointmentController($scope, $mdDialog, $rootScope, $filter, passRoom,
                                           roomServices, $mdToast) {
            // Dialog toggle
            $scope.roomDetails = passRoom;
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.makeAppointment = function () {

                $scope.appointment = {
                    patients: null,
                    room: null,
                    status: null,
                    condition: null
                };

                // Get patient's id
                $scope.appointment.patients = $rootScope.patUser['id'];

                // Get doctor's id
                $scope.appointment.room = passRoom['id'];

                if(passRoom['status'] == 'Open')
                    $scope.appointment.status = 1;
                else
                    $scope.appointment.status = 0;

                $scope.appointment.condition = $scope.condition;

                $scope.appointment.slot = passRoom['roomSize'] - passRoom['available'] + 1;

                // Save appointment into database
                appointmentServices.save($scope.appointment).then(function () {
                    passRoom['available'] = passRoom['available'] - 1;

                    roomServices.update(passRoom['id'], passRoom).then(function () {
                        $mdToast.show($mdToast.simple().textContent('Your appointment is created successful! ' +
                            'your slot number is ' + $scope.appointment.slot));
                    }, function (e) {
                        console.log(e.data.error);
                    });
                    $mdDialog.cancel();
                }, function (e) {
                    console.log(e.data.error);
                })

            }
        }

        function reviewPatient($scope, $mdDialog, $rootScope, $filter, passPatient, $mdToast) {
            // Dialog toggle
            $scope.roomDetails = passPatient;
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        }


    }]);

