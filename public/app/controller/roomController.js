/**
 * Created by REN on 8/5/2016.
 */
var app = angular.module('mainApp');
app.controller('roomController', ['$scope', '$mdDialog', 'roomServices', '$mdMedia', '$state', '$stateParams',
    'appointmentServices', '$rootScope', '$mdToast', 'patientServices',
    function ($scope, $mdDialog, roomServices, $mdMedia, $state, $stateParams, appointmentServices, $rootScope, $mdToast
        , patientServices) {

        $scope.loading = true;
        var currentUser = JSON.parse(localStorage.getItem('user'));


        var handleStatusColor = function(data){
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
            if ($rootScope.docUser != null) {
                try {
                    roomServices.findroombydoctor($rootScope.docUser['id'])
                        .then(function (roomData) {
                                handleStatusColor(roomData.data);
                            },
                            function (e) {
                                $scope.error = e;
                            })
                }
                catch (e) {
                    console.log(e);
                }
            }

        };

        // Load selected doctor's room list
        $scope.loadRoombyDoctor = function () {
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
                $state.go('home');

            }

        };


        $scope.loadAppointment = function () {
            try {
                appointmentServices.patientappoint($rootScope.patUser['id'])
                    .then(function (appointData) {
                            $scope.appointments = appointData.data;
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
                })
                .finally(function () {
                    $scope.loadRoom();
                });
        };


        $scope.showMakeAppointmentDialog = function (ev, room) {
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
                            .title('Opened time has not come yet')
                            .textContent('Please wait until start date to open the room.')
                            .ok('OK')
                    );
                }else{
                    var confirm = $mdDialog.confirm()
                        .title('Do you want to open the room?')
                        .textContent('Please choose your option.')
                        .ok('YES')
                        .cancel('BACK');

                    $mdDialog.show(confirm).then(function () {
                        roomServices.updateStatus(room.id, 1)
                            .then(function (response) {
                                appointmentServices.updateStatus(room.id, 1)
                                    .then(function () {
                                        enterRoom();
                                    });
                            })
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
        function createRoomController($scope, $mdDialog, $rootScope, $filter) {
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
                $scope.room.doctor = $rootScope.docUser['id'];

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
                    status: null
                };

                // Get patient's id
                $scope.appointment.patients = $rootScope.patUser['id'];

                // Get doctor's id
                $scope.appointment.room = passRoom['id'];

                $scope.appointment.status = 0;

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

