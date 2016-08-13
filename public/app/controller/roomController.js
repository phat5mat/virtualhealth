/**
 * Created by REN on 8/5/2016.
 */
var app = angular.module('mainApp');
app.controller('roomController',['$scope','$mdDialog','roomServices','$mdMedia','$state','$stateParams',
    'appointmentServices','$rootScope',
    function ($scope,$mdDialog,roomServices,$mdMedia,$state,$stateParams,appointmentServices,$rootScope) {

        $scope.loading = true;
        // Load all room
        $scope.loadRoom = function(){
            roomServices.get()
                .then(function(roomData) {
                        $scope.rooms = roomData.data;
                        $scope.loading = false;
                    },
                    function(e){
                        $scope.error = e;
                    })};
        
        // Load selected doctor's room list
        $scope.loadRoombyID = function(){
            try {
                $selectedDoc = $stateParams.selectedDoc.doctor;
                roomServices.findbydoctor($selectedDoc['id'])
                    .then(function(roomData){
                            $scope.docRooms = roomData.data;
                            $scope.loading = false;
                        },
                        function(e){
                            console.log(e.data.error);
                        })
            }
            catch (e){
                // go to home page when error occur or user refresh the page
                $state.go('home.pat');
            }

        }

        $scope.loadAppointment = function(){
            try {
                appointmentServices.patientappoint($rootScope.patUser['id'])
                    .then(function(appointData){
                            $scope.appointments = appointData.data;
                            $scope.loading = false;
                        },
                        function(e){
                            console.log(e.data.error);
                        })
            }
            catch (e){
                // go to home page when error occur or user refresh the page
                $state.go('home.pat');
            }
        }


        // Show Create new Room dialog
        $scope.showRoomDialog = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

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
                .finally(function(){
                    $scope.loadRoom();
                });
        }

        $scope.showMakeAppointmentDialog = function(ev,room) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

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
                })
                .finally(function(){
                    $scope.loadRoom();
                });
        }
        
        // remove room
        $scope.removeRoom = function(id) {
            $scope.loading = true;
            roomServices.destroy(id)
                .success(function(data) {
                    roomServices.get()
                        .success(function(roomData) {
                            $scope.rooms = roomData;
                            $scope.loading = false;
                        });
                })
                .error(function(e) {
                    console.log(e);
                });
        };


        // Controller of create room dialog
        function createRoomController($scope,$mdDialog,$rootScope,$filter){
            // Dialog toggle
            $scope.open1 = function() {
                $scope.startDatePicker.opened = true;
            };
            $scope.open2 = function() {
                $scope.endDatePicker.opened = true;
            };
            $scope.startDatePicker = {
                opened: false
            };
            $scope.endDatePicker = {
                opened: false
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            //Initialize date object
            $scope.startDateobj = new Date();
            $scope.endDateobj = new Date();

            $scope.createRoom = function(){
                // Get time from timepicker and set to startDate object
                var startH = $scope.startTime.getHours();
                var startM = $scope.startTime.getMinutes();
                $scope.room.startDateobj.setHours(startH);
                $scope.room.startDateobj.setMinutes(startM);
                var datefilter = $filter('date');
                var formattedDate = datefilter( $scope.room.startDateobj, 'yyyy-MM-dd HH:mm:ss');
                $scope.room.startDate = formattedDate;

                // Get time from timepicker and set to endDate object
                var endH = $scope.endDateobj.getHours();
                var endM = $scope.endDateobj.getMinutes();
                $scope.room.endDateobj.setHours(endH);
                $scope.room.endDateobj.setMinutes(endM);
                var formattedDate = datefilter( $scope.room.endDateobj, 'yyyy-MM-dd HH:mm:ss');
                $scope.room.endDate = formattedDate;

                // Get doctor's id
                $scope.room.doctor = $rootScope.docUser['id'];
                
                // Save room into database
                roomServices.save($scope.room).success(function(){
                    $mdToast.show($mdToast.simple().textContent('Room is created successful!'));
                    $mdDialog.cancel();
                },function(e){
                    console.log(e.data.error);
                })

            }
        }

        // make appointment dialog controller 
        function makeAppointmentController($scope,$mdDialog,$rootScope,$filter,passRoom,
        roomServices,$mdToast){
            // Dialog toggle
            $scope.roomDetails = passRoom;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            
            $scope.makeAppointment = function(){

                $scope.appointment = {
                    patients: null,
                    room: null,
                    status: null
                }

                // Get patient's id
                $scope.appointment.patients = $rootScope.patUser['id'];
                
                // Get doctor's id
                $scope.appointment.room = passRoom['id'];

                $scope.appointment.status = 0;

                $scope.appointment.slot = passRoom['roomSize'] - passRoom['available'] + 1;

                // Save room into database
                appointmentServices.save($scope.appointment).then(function(){
                    passRoom['available'] = passRoom['available'] - 1;

                    roomServices.update(passRoom['id'],passRoom).then(function(){
                        $mdToast.show($mdToast.simple().textContent('Your appointment is created successful! ' +
                            'your slot number is ' + $scope.appointment.slot));
                    },function(e){
                        console.log(e.data.error);
                    })
                    $mdDialog.cancel();
                },function(e){
                    console.log(e.data.error);
                })

            }
        }
    }]);

