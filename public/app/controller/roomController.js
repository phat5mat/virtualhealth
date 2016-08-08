/**
 * Created by REN on 8/5/2016.
 */
var app = angular.module('mainApp');
app.controller('roomController',['$scope','$mdDialog','roomServices','$mdMedia',
    function ($scope,$mdDialog,roomServices,$mdMedia) {

        $scope.loadRoom = function(){
            roomServices.get()
                .then(function(roomData) {
                        $scope.rooms = roomData.data;
                        $scope.loading = false;
                    },
                    function(e){
                        $scope.error = e;
                    })};
        
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
                });
        }

        function createRoomController($scope,$mdDialog,$rootScope,$filter){
            // Dialog toggle
            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };
            $scope.open2 = function() {
                $scope.popup2.opened = true;
            };
            $scope.popup1 = {
                opened: false
            };
            $scope.popup2 = {
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
                    console.log('success');
                },function(e){
                    console.log(e.data.error);
                })

            }
        }
    }]);

