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
    '$filter', 'examinationServices', 'appointmentServices'
    , function ($scope, $location, $http, userServices, specialityServices, doctorServices, $state, $auth, $mdDialog
        , $mdMedia, patientServices, $rootScope, $mdToast, $timeout, $filter, examinationServices,
                appointmentServices) {

        var currentUser = $rootScope.currentUser;
        var avatarPath = "assets/img/avatar-" + currentUser.username + ".jpg";
        var random = (new Date()).toString();
        var today = new Date();

        $scope.totalAppointment = 0;
        $scope.totalExamination = 0;

        $scope.examToday = 0;
        $scope.examWeek = 0;
        $scope.examMonth = 0;
        $scope.examYear = 0;

        $scope.openAppoint = 0;
        $scope.waitingAppoint = 0;
        $scope.canceledAppoint = 0;
        $scope.finishedAppoint = 0;

        $scope.appointmentList = [];
        $scope.roomDate = [];
        $scope.events = [];
        $scope.cal = {
            dt: new Date()
        };
        $scope.cal.dt = new Date();

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

        $scope.loadAppointmentInfo = function () {
            appointmentServices.patientappoint($rootScope.patUser.id)
                .then(function (response) {
                    $scope.appointmentList = response.data;
                    angular.forEach(response.data, function (value, key) {
                        $scope.roomDate.push(new Date(value.room.startDate));
                    });
                    customCalendar();
                    $scope.loadAppointmentStats();
                    $scope.loadNotification();
                })
        };
        $scope.convertDate = function (date) {
            return new Date(date)
        };

        $scope.goAppoint = function (appoint) {
            $state.go('exam', {
                selectedRoom: appoint.room,
                selectedAppoint: appoint.id
            });

        };

        $scope.goLastExam = function () {
            $state.go('examDetails', {selectedExam: $scope.lastExam})
        };


        $scope.loadAppointmentStats = function() {
            angular.forEach($scope.appointmentList,function(value, key){
                if (value.status == 0) {
                    $scope.totalAppointment++;
                    $scope.waitingAppoint++;
                }
                if (value.status == 1) {
                    $scope.totalAppointment++;
                    $scope.openAppoint++;
                }
                if (value.status == 2) {
                    $scope.totalAppointment++;
                    $scope.finishedAppoint++;
                }
                if (value.status == 3) {
                    $scope.totalAppointment++;
                    $scope.canceledAppoint++;

                }
            });

        }

        $scope.loadExaminationInfo = function() {
            examinationServices.getExamByPatient($rootScope.patUser.id)
                .then(function (response) {
                    angular.forEach(response.data, function (value, key) {
                        if (value.examination != null) {
                            $scope.totalExamination++;
                            var date = new Date(value.examination.date);
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

                    })


                })
        };

        $scope.loadNotification = function () {
            $scope.appointNotification = [];
            angular.forEach($scope.appointmentList, function (value, key) {
                selectedDate = new Date($scope.cal.dt.toDateString());
                var roomDate = new Date(value.room.startDate);
                var roomDateDay = new Date(roomDate.toDateString());

                //if selected day is not today
                if (roomDateDay.getTime() == selectedDate.getTime()
                    && new Date(selectedDate).toDateString() != new Date().toDateString()) {
                    if (value.status == 0) {
                        value.isTime = false;
                        $scope.appointNotification.push(value);
                    }
                }

                //if selected day is today
                if (roomDateDay.getTime() == selectedDate.getTime()
                    && new Date(selectedDate).toDateString() == new Date().toDateString()) {
                    if (value.status == 0 || value.status == 1) {
                        if (roomDate.getTime() <= $scope.cal.dt.getTime() && value.status == 0)
                            value.isTime = true;
                        if (roomDate.getTime() > $scope.cal.dt.getTime() && value.status == 0)
                            value.isTime = false;
                        if (value.status == 1)
                            value.isOpen = true;
                        $scope.appointNotification.push(value);
                    }
                }


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

        $scope.loadLastExamination = function () {
            examinationServices.getLastExamByPatient($rootScope.patUser.id)
                .then(function (response) {
                    response.data.examination.date = new Date(response.data.examination.date)
                    $scope.lastExam = response.data
                })
        };


     


    }]);





    

