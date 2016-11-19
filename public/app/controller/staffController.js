/**
 * Created by REN on 7/28/2016.
 */

var app = angular.module('mainApp');
app.controller('staffController', ['$scope', '$location', '$http', 'userServices', 'doctorServices', '$filter', '$state', '$auth',
    '$stateParams', '$mdToast', '$q', 'specialityServices', 'downloadServices',
    function ($scope, $location, $http, userServices, doctorServices, $filter, $state, $auth, $stateParams, $mdToast, $q
        , specialityServices, downloadServices) {

        $scope.events = [];
        $scope.doctors = [];
        $scope.loading = true;
        $scope.totalDoctor = 0;
        $scope.totalRequest = 0;

        $scope.inactiveDoc = 0;
        $scope.activeDoc = 0;
        $scope.rejectDoc = 0;
        $scope.userCreatedDate = [];
        $scope.cal = {
            dt: new Date()
        };
        var today = new Date();
        $scope.cal.dt = new Date();

        function customCalendar() {
            angular.forEach($scope.userCreatedDate, function (value, key) {
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

        function checkRequestExist(){
            if($scope.doctors.length == 0 )
                $scope.noRequest = true;
            else
                $scope.noRequest = false;

        }
        $scope.today = function () {
            $scope.cal.dt = new Date();
            $scope.loadNotification();
        };


        $scope.loadRequest = function () {
            doctorServices.findByRequest()
                .then(function (res) {
                        $scope.users = res.data;
                        // Convert status into text
                        angular.forEach($scope.users, function (value, key) {
                            if(value.doctor.status == 0){
                                value.created_at = new Date(value.created_at);
                                specialityServices.getSpecialByDoctor(value.doctor.id)
                                    .then(function (response) {
                                        value.doctor.speciality = response.data;
                                    });
                                $scope.doctors.push(value);
                            }
                            checkRequestExist()
                        });
                        $scope.loading = false;
                    },
                    function (e) {
                        console.log(e);
                    })
        };


        $scope.checkRequest = function () {
            doctorServices.checkRequest()
                .then(function (response) {
                    $scope.req = response.data;
                    angular.forEach($scope.req, function (value, key) {
                        $scope.totalRequest++;
                        $scope.userCreatedDate.push(new Date(value.user.created_at));
                    });
                    customCalendar();
                    $scope.loadNotification();
                    $scope.loadDoctorInfo();
                    $scope.loading = false;
                }, function (e) {
                    console.log(e);
                })
        };

        $scope.convertDate = function (date) {
            return new Date(date)
        };
        

        $scope.loadDoctorInfo = function () {
            doctorServices.getAllDoc()
                .then(function (response) {
                    $scope.doctorList = response.data;
                    angular.forEach($scope.doctorList, function (value, key) {
                        if (value.status == 0) {
                            $scope.totalDoctor++;
                            $scope.inactiveDoc++
                        }
                        if (value.status == 1) {
                            $scope.totalDoctor++;
                            $scope.activeDoc++
                        }
                        if (value.status == 2) {
                            $scope.totalDoctor++;
                            $scope.rejectDoc++
                        }

                    })
                })
        };


        $scope.loadNotification = function () {
            $scope.requestNotification = [];
            angular.forEach($scope.req, function (value, key) {
                selectedDate = new Date($scope.cal.dt.toDateString());
                var userDate = new Date(value.user.created_at);
                var userDateDay = new Date(userDate.toDateString());

                if (userDateDay.getTime() == selectedDate.getTime()) {
                    $scope.requestNotification.push(value);
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

        $scope.selectRequest = function (user) {
            doctorServices.findByUser(user.id)
                .then(function(res){
                    user.doctor = res.data.doctor;
                    $state.go('reviewDoctor', {doctor: user});
                });
        };

        $scope.loadRequestDetails = function () {
            $scope.doctor = $stateParams.doctor;
            console.log($scope.doctor)
            $scope.checkRequest();
        };

        $scope.approveRequest = function (doctorname) {
            doctorServices.approveRequest($scope.doctor.doctor.id)
                .then(function (data) {
                    console.log(doctorname)
                    $state.go('viewRequest');
                    $mdToast.show($mdToast.simple().textContent('Doctor ' + doctorname.name + ' is ' +
                        'actived!!'));
                }, function (e) {
                    console.log(e);
                })
        };

        $scope.rejectRequest = function (doctorname) {
            doctorServices.rejectRequest($scope.doctor.doctor.id)
                .then(function (data) {
                    $state.go('viewRequest');
                    $mdToast.show($mdToast.simple().textContent('Doctor ' + doctorname.name + ' is ' +
                        'rejected!!'));
                    $scope.checkRequest();
                }, function (e) {
                    console.log(e);
                })
        };


        $scope.downloadZip = function () {
            var filename = 'doctorID-' + $scope.doctor.doctor.id + '.zip';
            downloadServices.downloadZip(filename)
                .then(function (response) {
                    var blob = new Blob([response.data]);
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob(blob, filename);
                    }
                    else {
                        var file = window.document.createElement('a');
                        file.href = window.URL.createObjectURL(blob);
                        file.download = "Dr." + $scope.doctor.name + '-Certification.zip';
                        document.body.appendChild(file);
                        file.click();
                        document.body.removeChild(file);
                    }

                })
        };

    }]);





    

