var app = angular.module('mainApp');

app.controller('doctorController', ['$scope', '$http', '$window', 'doctorServices',
    '$mdToast', '$timeout', '$rootScope', 'roomServices', 'appointmentServices', 'examinationServices',
    '$q', 'specialityServices', 'patientServices','$state','$mdDialog','$mdMedia'
    , function ($scope, $http, $window, doctorServices, $mdToast, $timeout, $rootScope, roomServices
        , appointmentServices, examinationServices, $q, specialityServices, patientServices,$state
    ,$mdDialog,$mdMedia) {

        var upId = null;
        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username + ".jpg";
        var random = (new Date()).toString();
        var today = new Date();

        $scope.cal = {
            dt: new Date()
        };
        $scope.cal.dt = new Date();

        $scope.waitingRoom = 0;
        $scope.closedRoom = 0;
        $scope.finishedRoom = 0;
        $scope.openRoom = 0;
        $scope.waitingAppoint = 0;
        $scope.canceledAppoint = 0;
        $scope.finishedAppoint = 0;
        $scope.openAppoint = 0;
        $scope.examToday = 0;
        $scope.examWeek = 0;
        $scope.examMonth = 0;
        $scope.examYear = 0;
        $scope.totalRoom = 0;
        $scope.totalAppointment = 0;
        $scope.totalExamination = 0;
        $scope.totalPatient = 0;
        $scope.patList = [];
        $scope.appointList = [];
        $scope.roomDate = [];
        $scope.events = [];
        $scope.roomNotification = [];

        function customCalendar() {
            angular.forEach($scope.roomDate, function (value, key) {
                $scope.events.push({
                    date: value,
                    status: 'busy'
                });
            });
            $scope.options = {
                customClass: getDayClass
            };
            $scope.calendarLoaded = true;

        }


        function getDayClass(data) {
            var date = data.date;
            var mode = data.mode;
            if (mode === 'day') {
                var dayData = new Date(date).setHours(0, 0, 0, 0);
                for (var i = 0; i < $scope.events.length; i++) {
                    var customDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                    if (dayData === customDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }


        $scope.today = function () {
            $scope.cal.dt = new Date();
            $scope.loadNotification();
        };

        doctorServices.get()
            .success(function (docData) {
                $scope.doctors = docData;
                $scope.loading = false;
            });


        $scope.saveDoc = function () {
            $scope.loading = true;
            doctorServices.save($scope.doctor)
                .success(function (data) {

                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };


        $scope.removeDoc = function (id) {
            $scope.loading = true;
            doctorServices.destroy(id)
                .success(function (data) {
                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };


        $scope.updateDoc = function () {
            doctorServices.update(upId, $scope.doctor)
                .success(function (data) {
                    docServices.get()
                        .success(function (docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function (e) {
                    console.log(e);
                });
        };

        $scope.loadDoctorInfo = function () {
            try {
                doctorServices.findByUser(currentUser.id)
                    .then(function (response) {
                        var doc = response.data;
                        if (doc.avatar == 0)
                            $scope.imgSrc = 'assets/img/no-avatarDoctor.png';
                        else
                            $scope.imgSrc = avatarPath + "?cb=" + random;
                    });
                $scope.loadRoomInfo();
                loadExamination();
            }
            catch (e) {
                $state.go('login');
            }

        };


        $scope.loadRoomInfo = function () {
            roomServices.findroombydoctor($rootScope.docUser.doctor.id)
                .then(function (response) {
                    $scope.totalRoom = response.data.length;
                    $scope.roomList = response.data;
                    angular.forEach(response.data, function (value, key) {
                        $scope.roomDate.push(new Date(value.startDate));
                        if (value.status == 0)
                            $scope.waitingRoom++;
                        if (value.status == 1)
                            $scope.openRoom++;
                        if (value.status == 2)
                            $scope.finishedRoom++;
                        if (value.status == 3)
                            $scope.closedRoom++;
                        appointmentServices.doctorappoint(value.id)
                            .then(function (response) {
                                if (response.data.length > 1) {
                                    angular.forEach(response.data, function (value, key) {
                                        loadAppointmentInfo(value)
                                    })
                                }
                                if (response.data.length == 1) {
                                    loadAppointmentInfo(response.data[0].status)
                                }
                            });
                    });
                    customCalendar();
                    $scope.loadNotification();
                })
        };

        $scope.loadPatientList = function () {
            patientServices.findByDoctor($rootScope.docUser.doctor.id)
                .then(function (response) {
                    angular.forEach(response.data, function (value, key) {
                        if (value.appointment.length >= 1) {
                            angular.forEach(value.appointment, function (value2, key2) {
                                if (value2.examination != null) {
                                    if ($scope.patList.length > 0) {
                                        angular.forEach($scope.patList, function (value3, key3) {
                                            if (value3.user.username != value2.patient.user.username) {
                                                $scope.patList.push(value2.patient);
                                            }
                                        })
                                    } else {
                                        $scope.patList.push(value2.patient);
                                    }

                                }
                            })
                        }
                        else {
                            if (value.appointment.examination != null) {
                                if ($scope.patList.length > 0) {
                                    angular.forEach($scope.patList, function (value3, key3) {
                                        if (value3.user.username != value2.patient.user.username) {
                                            $scope.patList.push(value.appointment.patient)
                                        }
                                    })
                                } else {
                                    $scope.patList.push(value.appointment.patient)
                                }
                            }
                        }
                    });
                    angular.forEach($scope.patList, function (value, key) {
                        if (value.user.avatar == 0)
                            value.user.avatarSrc = 'assets/img/no-avatar.png';
                        else
                            value.user.avatarSrc = "assets/img/avatar-" + value.user.username + ".jpg?cb=" + random;
                    });

                })
        };


        $scope.loadNotification = function () {
            $scope.roomNotification = [];
            angular.forEach($scope.roomList, function (value, key) {
                selectedDate = new Date($scope.cal.dt.toDateString());
                var roomDate = new Date(value.startDate);
                var roomDateDay = new Date(roomDate.toDateString());

                //if selected day is not today
                if (roomDateDay.getTime() == selectedDate.getTime()
                    && new Date(selectedDate).toDateString() != new Date().toDateString()) {
                    if (value.status == 0)
                    {
                        value.isTime = false;
                        $scope.roomNotification.push(value);
                    }
                }

                //if selected day is today
                if (roomDateDay.getTime() == selectedDate.getTime()
                    && new Date(selectedDate).toDateString() == new Date().toDateString())
                {
                    if(value.status == 0 || value.status == 1){
                        if (roomDate.getTime() <= $scope.cal.dt.getTime() && value.status == 0)
                            value.isTime = true;
                        if (roomDate.getTime() > $scope.cal.dt.getTime() && value.status == 0)
                            value.isTime = false;
                        if(value.status == 1)
                            value.isOpen = true;
                        $scope.roomNotification.push(value);
                    }
                }


            })
        };

        $scope.convertDate = function (date) {
            return new Date(date)
        };

        $scope.goRoom = function(room){
            $state.go('exam', {
                selectedRoom: room
            })
        };

        $scope.goOpenRoom = function(room){
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
                                $state.go('exam', {
                                    selectedRoom: room
                                })
                            });
                    })
            });
        }

        function loadAppointmentInfo(app) {
            if (app.status == 0) {
                $scope.totalAppointment++;
                $scope.waitingAppoint++;
            }
            if (app.status == 1) {
                $scope.totalAppointment++;
                $scope.openAppoint++;
            }
            if (app.status == 2) {
                $scope.totalAppointment++;
                $scope.finishedAppoint++;
            }
            if (app.status == 3) {
                $scope.totalAppointment++;
                $scope.canceledAppoint++;

            }
        }

        function loadExamination() {
            examinationServices.getExamByDoctor($rootScope.docUser.doctor.id)
                .then(function (response) {
                    specialityServices.getSpecialByDoctor($rootScope.docUser.doctor.id)
                        .then(function (response2) {
                            $scope.specList = response2.data;
                            angular.forEach($scope.specList, function (value4, key4) {
                                value4.speciality.count = 0;
                            });

                            angular.forEach(response.data, function (value, key) {
                                if (value.appointment.length >= 1) {
                                    angular.forEach(value.appointment, function (value2, key2) {
                                        if (value2.examination != null) {
                                            angular.forEach($scope.specList, function (value3, key3) {
                                                if (value3.speciality.name == value.speciality.name) {
                                                    value3.speciality.count++;
                                                    $scope.totalPatient++;
                                                }
                                            });
                                            $scope.totalExamination++;
                                            var date = new Date(value2.examination.date);
                                            var firstDay = today.getDate() - today.getDay() + 2;
                                            var lastDay = firstDay + 6;
                                            var firstDate = new Date(today.setDate(firstDay));
                                            var lastDate = new Date(today.setDate(lastDay));
                                            if (date.getFullYear() == today.getFullYear()) {
                                                $scope.examYear++;
                                                if (today.getDate() == date.getDate())
                                                    $scope.examToday++;
                                                if (firstDate.getTime() < date.getTime() < lastDate.getTime())
                                                    $scope.examWeek++;
                                                if (date.getMonth() == today.getMonth())
                                                    $scope.examMonth++;
                                            }
                                        }
                                    });


                                }

                            })
                        });

                })
        }


    }]);