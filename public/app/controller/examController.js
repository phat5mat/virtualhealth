var app = angular.module('mainApp');

app.controller('examController',['$scope','$http','$window','doctorServices','$mdToast','$timeout','patientServices',
    '$stateParams','$state'
    , function($scope, $http, $window, doctorServices,$mdToast,$timeout,patientServices,$stateParams,$state) {


        $scope.loadRoomPatients = function(){
            if(!localStorage.getItem('selectRoom'))
            {
                try{
                    localStorage.setItem('selectRoom',$stateParams.selectedRoom.id);
                    patientServices.findByRoom($stateParams.selectedRoom.id)
                        .then(function(patientsData){
                            $scope.roomPatients = patientsData.data;
                            angular.forEach($scope.roomPatients,function(user, key) {
                                var age = new Date().getFullYear() -
                                    $scope.roomPatients[key].patient.user.dateofbirth.substring(0,4);
                                $scope.roomPatients[key].patient.user.age = age
                            });
                            $scope.loading = false;
                        },function(e){
                            console.log(e)
                        })
                    localStorage.removeItem('selectRoom');
                }
                catch (e){
                    $state.go('room.manageRoom')
                }
            }

        }
        
        var pubnub = new PUBNUB({
            publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
            subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
            uuid: JSON.parse(localStorage.getItem('user'))['username'],
            ssl: true
        })

        $scope.chatContent = [];
        var videoBox = document.getElementById("videoBox");
        
        $scope.subcribe = function(){
            console.log('Subcribing Room.....')
            try{
                pubnub.subscribe({
                    channel : $stateParams.selectedRoom.id,
                    presence : function(m){
                        console.log(m)
                    },
                    message : function( message, env, channel ){
                        // RECEIVED A MESSAGE.
                        console.log(message)
                        $timeout(function() {
                            $scope.chatContent.push(message['textMessage']);
                        });
                    },
                    connect : function(){
                        console.log("Connected to " + $stateParams.selectedRoom.name)
                    },
                    disconnect : function(){
                        console.log("Disconnected")
                    },
                    reconnect : function(){
                        console.log("Reconnected")
                    },
                    error : function(){
                        console.log("Network Error")
                    },
                })
            }catch(e){
                $state.go('room.manageRoom')
            }
        }


        $scope.connectNext = function(){
            console.log('Subcribing Doctor.....')
            try{
                pubnub.subscribe({
                    channel : "doc" + $stateParams.selectedRoom.doctor,
                    presence : function(m){
                        console.log(m)
                    },
                    message : function( message, env, channel ){
                        // RECEIVED A MESSAGE.
                        console.log(message)
                        $timeout(function() {
                            $scope.chatContent.push(message['textMessage']);
                        });
                    },
                    connect : function(){
                        console.log("Connected to " + $stateParams.selectedRoom.name)
                    },
                    disconnect : function(){
                        console.log("Disconnected")
                    },
                    reconnect : function(){
                        console.log("Reconnected")
                    },
                    error : function(){
                        console.log("Network Error")
                    },
                })
            }catch(e){
                $state.go('room.manageRoom')
            }
        }

        $scope.sendMessage = function(){
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            console.log('Sending....')

            pubnub.publish({
                channel : $scope.roomName,
                message: {
                    textMessage: $scope.messageContent
                },
                callback : function(m){
                    console.log(m)
                }
            });
            $scope.messageContent = '';


        }


        $scope.subcribePhone = function () {
            var phone = window.phone = PHONE({
                number        : $scope.roomName, // listen on username line else Anonymous
                publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06', // Your Pub Key
                subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe', // Your Sub Key
            });
            phone.ready(function(){
                console.log("Video Ready!!")
            });
            phone.receive(function(session){
                session.connected(function(session) {
                    videoBox.appendChild(session.video);
                });
                session.ended(function(session) {
                    videoBox.innerHTML='';
                });
            });
        }


        $scope.call = function (){
            phone.dial($scope.roomName);
        }


    }]);