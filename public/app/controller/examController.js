var app = angular.module('mainApp');

app.controller('examController',['$scope','$http','$window','doctorServices','$mdToast','$timeout','patientServices',
    '$stateParams','$state','$rootScope','userServices','appointmentServices','$mdDialog'
    , function($scope, $http, $window, doctorServices,$mdToast,$timeout,patientServices,$stateParams,
               $state,$rootScope,userServices,appointmentServices,$mdDialog) {

        // Initialize components
        $scope.roomPatients = [];
        $scope.chatContent = [];
        var contactObj = null;
        var videoBox = document.getElementById("videoBox");
        var currentUser = JSON.parse(localStorage.getItem('user'));
        $scope.loading = true;
            if(currentUser.role == 0)
                $scope.patLoadingText = true;
            else
                $scope.patLoadingText = false;



        // Initialize pubnub object which interact pubnub cloud server
        var pubnub = new PUBNUB({
            publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
            subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
            uuid: currentUser,
            ssl: true
        })

        $scope.loadRoomDetails = function(){
            $scope.roomDetails2 = $stateParams.selectedRoom;
        }

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

        $scope.loadRoomDoctor = function(){
            try{
                $scope.roomDoctor = $stateParams.selectedRoom.doctor
            }
            catch (e){
                $state.go('room.manageRoom')
            }
        }
        
        // User subcribe to room channel when they enter the room 
        $scope.subcribe = function(){
            subcribeRoom()
            
        }


        $scope.connectNext = function(){
            console.log('Subcribing Doctor.....')
            try{
                pubnub.publish({
                    channel : 'room'+$stateParams.selectedRoom.id,
                    message: {
                        joinMessenger: true
                    },
                    callback : function(m){
                        console.log(m)
                    }
                });

            }catch(e){
                $state.go('room.manageRoom')
            }
        }


        // User send message to other partner
        $scope.sendMessage = function(){
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            var bubbleSpeech = null;
            console.log('Sending....')
            console.log($stateParams.selectedRoom)
            if(currentUser.role == 1)
                bubbleSpeech = 'docSpeech'
            else 
                bubbleSpeech = 'patSpeech'
            
            pubnub.publish({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                message: {
                    textMessages: $scope.messageContent,
                    userName: currentUser.name,
                    sentDate: new Date(),
                    bubble: bubbleSpeech
                },
                callback : function(m){
                    console.log("sent to " + $stateParams.selectedRoom.doctor.user.username)
                }
            });
            $scope.messageContent = '';


        }


        // User subcribe to video call function channel and enable webcam device
        $scope.subcribePhone = function () {
            var phone = window.phone = PHONE({
                number        :  $rootScope.currentUser.username, // listen on username line else Anonymous
                publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06', // Your Pub Key
                subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe', // Your Sub Key
            });
            phone.ready(function(){
                console.log($rootScope.currentUser.username + " Video Ready!!")
                if(currentUser.role == 1){
                    pubnub.publish({
                        channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                        message: {
                            videoCall: true
                        },
                        callback: function(m){
                            console.log(m)
                        }
                    });
                }
            });
            phone.receive(function(session){
                session.connected(function(session) {
                    $timeout(function(){
                        session.video.className += "videoBlock"
                        videoBox.appendChild(session.video);
                        $scope.video = true;
                    },2000)
                });
                session.ended(function(session) {
                    videoBox.innerHTML='';
                    $scope.video = false;
                    session.hangup();
                });
            });
        }


        $scope.makeCall = function(){
            if(currentUser.role == 0)
            {
                phone.dial($stateParams.selectedRoom.doctor.user.username)
                console.log('call ' + $stateParams.selectedRoom.doctor.user.username)
            }
            else
            {
                $timeout(function(){
                    phone.dial(localStorage.getItem('patInfo'));
                    console.log('call' + localStorage.getItem('patInfo'))
                },2000)

            }
        }
        
        // function that is called when user join room
        var joinRoom = function(){
            pubnub.here_now({
                channel: 'room'+$stateParams.selectedRoom.id,
                state: true,
                callback: function(m) {
                    $scope.loading = true;
                    $scope.roomPatients = [];

                    //get users that already subcribed to channel
                    var contacts = m['uuids']

                    // get and handle information of each user and push to scope
                    angular.forEach(contacts,function(contact, key){
                            $timeout(function(){
                                contactObj = JSON.parse(contact.uuid);
                                if(contactObj.role == 0)
                                {
                                    // Convert date into age
                                    var age = new Date().getFullYear() -
                                        contactObj.dateofbirth.substring(0,4);
                                    contactObj.age = age

                                    // Get slot number
                                    var slot = {
                                        user: contactObj.id,
                                        room: localStorage.getItem('chatRoom')
                                    }

                                    getNumber(slot)

                                    // Update contacts list
                                    $scope.roomPatients.push(contactObj)
                                }
                                if(contactObj.role == 1)
                                    $scope.online = true;


                            })
                    })
                    $scope.loading = false;

                }
            });
        }

        // get slot number
        var getNumber = function(data){

            appointmentServices.getslotnumber(data)
                .then(function(appoint){
                    angular.forEach($scope.roomPatients,function(value,key){
                        if(value.id == data.user){
                            value.slot = appoint.data[0].slot
                        }
                    })
                    filterSlot()
                },function(e){
                    console.log(e)
                })
        }

        // sort slot number
        var filterSlot = function(){
            if($scope.roomPatients.length != 0){
                var min = $scope.roomPatients[0].slot;
                angular.forEach($scope.roomPatients,function(value, key){
                    if(value.slot < min)
                        min = value.slot
                })
                $scope.nextSlot = min;
            }
        }

        // function that is called when user leave room or close browser ( timeout )
        var leaveRoom = function(user){

            var unsubPubnub = new PUBNUB({
                publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
                subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
                uuid: user,
                ssl: true
            })

                unsubPubnub.unsubscribe({
                    channel : 'room'+$stateParams.selectedRoom.id
                });



            angular.forEach($scope.roomPatients,function(value, key){
                if(value.username == user.username){
                    $timeout(function(){
                        $scope.roomPatients.splice(key,1)
                        if(value.role == 1)
                            $scope.online = false;
                        console.log(value.username + " Has Left Room!!")
                    })
                }
            })
            joinRoom()
        }

        var leaveDoctor = function(user){

            pubnub.unsubscribe({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username
            });

            console.log('Disconnect with ' + $stateParams.selectedRoom.doctor.user.username)
            $scope.loadChat = true;
        }

        var subcribeDoc = function(){
            pubnub.subscribe({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                heartbeat : 10,

                presence : function(m){
                    var action = m.action
                    if(action == 'join')
                    {
                        if(currentUser.role == 0)
                        {
                            pubnub.publish({
                                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                                message: {
                                    patInfo: currentUser.username
                                },
                                callback : function(m){
                                    console.log(m)
                                }
                            });
                        }
                    }
                    if(action == 'leave' || action == 'timeout')
                        leaveDoctor(JSON.parse(m['uuid']))
                },
                message : function( message, env, channel ){
                    console.log(message)
                    // RECEIVED A MESSAGE.
                    if(message['patInfo']){
                        localStorage.setItem('patInfo',message.patInfo)
                    }
                    if(message['videoCall']){
                        if(currentUser.role == 0){
                            console.log('test')
                            $scope.subcribePhone()
                            var confirm = $mdDialog.confirm()
                                .title('Doctor is calling you!!!')
                                .textContent('All of the banks have agreed to forgive you your debts.')
                                .ariaLabel('Lucky day')
                                .ok('Accept')
                                .cancel('Reject');

                            $mdDialog.show(confirm).then(function() {
                                pubnub.publish({
                                    channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                                    message: {
                                        videoCallAccept: true
                                    }
                                });
                            }, function() {
                                pubnub.publish({
                                    channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                                    message: {
                                        videoCallReject: true
                                    }
                                });
                            });
                        }
                    }
                    if(message['videoCallAccept']){
                            $scope.makeCall()
                    }
                    if(message['videoCallReject']){
                        $mdToast.show($mdToast.simple().textContent('Video call is rejected'));
                    }
                    $timeout(function() {
                        $scope.chatContent.push(message);
                    });
                },
                connect : function(){
                    console.log("Connected to " + $stateParams.selectedRoom.doctor.user.username)
                    $scope.loadChat = false;
                    $scope.patLoadingText = false;

                },
                disconnect : function(){
                    console.log("Disconnected")
                    $scope.loadChat = true;
                    $scope.patLoadingText = true;
                },
                reconnect : function(){
                    console.log("Reconnected")
                },
                error : function(){
                    console.log("Network Error")
                },
            })
        }

        var subcribeRoom = function(){
            console.log('Subcribing Room.....')
            try{
                localStorage.setItem('chatRoom',$stateParams.selectedRoom.id)
                pubnub.subscribe({
                    channel : 'room'+$stateParams.selectedRoom.id,

                    // heart beat get user's state for every 10 seconds
                    heartbeat : 10,

                    // handle user's action
                    presence : function(m){
                        var action = m.action
                        if(action == 'join')
                            joinRoom()
                        if(action == 'leave' || action == 'timeout')
                            leaveRoom(JSON.parse(m['uuid']))



                    },
                    message : function( message, env, channel ){
                        // RECEIVED A MESSAGE.
                        console.log(message)
                        $timeout(function() {
                            if(message['joinMessenger'])
                            {
                                subcribeDoc()
                                if(currentUser.role == 0)
                                    $mdToast.show($mdToast.simple().textContent('You are now connecting with Doctor!'));
                                if(currentUser.role == 1)
                                    $mdToast.show($mdToast.simple().textContent('You are now connecting with Patient !'));


                            }
                        });
                    },

                    connect : function(){
                        //User subcribe to channel successfully
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

    }]);