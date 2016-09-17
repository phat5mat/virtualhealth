var app = angular.module('mainApp');

app.controller('examController',['$scope','$http','$window','doctorServices','$mdToast','$timeout','patientServices',
    '$stateParams','$state','$rootScope','userServices','appointmentServices','$mdDialog','$mdMedia'
    , function($scope, $http, $window, doctorServices,$mdToast,$timeout,patientServices,$stateParams,
               $state,$rootScope,userServices,appointmentServices,$mdDialog,$mdMedia) {

        // Initialize components
        $scope.roomPatients = [];
        $scope.chatContent = [];
        var contactObj = null;
        $scope.detailsTab = true;
        var videoBox = document.getElementById("videoBox");
        var localVideo = document.getElementById("localVideoBox");
        var currentUser = JSON.parse(localStorage.getItem('user'));
        $scope.nextSlot = 0;
        $scope.currentSlot = 0;
        $scope.loading = true;
        $scope.med = {
            medName: '',
            medQuantity: ''
        };
        $scope.hoverIn = function(){
            this.hoverEdit = true;
        };

        $scope.hoverOut = function(){
            this.hoverEdit = false;
        };
        $scope.medicines = [];

        if(currentUser.role == 0)
        {
            $scope.patLoadingText = true;
            $scope.docLoadingText = false;
        }
        else
        {
            $scope.docLoadingText = true;
            $scope.patLoadingText = false;
        }




        if(!$rootScope.alreadySubscribed){
            console.log('subscribing....');
            // Initialize pubnub object which interact pubnub cloud server
            pubnub = new PUBNUB({
                publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
                subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
                uuid: currentUser,
                ssl: true
            });

            phone = window.phone = PHONE({
                number        :  $rootScope.currentUser.username, // listen on username line else Anonymous
                publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06', // Your Pub Key
                subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe' // Your Sub Key
            });

            ctrl = window.ctrl = CONTROLLER(phone);
            $rootScope.alreadySubscribed = true;

        }
        
        $scope.loadRoomDetails = function(){
            $scope.roomDetails2 = $stateParams.selectedRoom;
        };

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
                        });
                    localStorage.removeItem('selectRoom');
                }
                catch (e){
                    $state.go('room.manageRoom')
                }
            }
        };

        $scope.loadRoomDoctor = function(){
            try{
                $scope.roomDoctor = $stateParams.selectedRoom.doctor
            }
            catch (e){
                if(currentUser.role == 1)
                    $state.go('room.manageRoom')
                else
                    $state.go('appoint')
            }
        };

        // User subcribe to room channel when they enter the room 
        $scope.subcribe = function(){
            try{
                subcribeRoom();
                $timeout(function(){
                    loadCurrentContacts();
                    checkContacts();
                },2000)

            }
            catch(e){
                if(currentUser.role == 1)
                    $state.go('room.manageRoom')
                else
                    $state.go('appoint')

            }
        };

        $scope.connectNext = function(){
            if($scope.roomPatients.length == 0){
                $mdToast.show($mdToast.simple().textContent('There is no any patient in room'));
            }else{
                try{
                    console.log('Subcribing Doctor.....');
                    subcribeDoc();
                    sendRoomMessage({joinMessenger: true});

                }catch(e){
                    $state.go('room.manageRoom')
                }
            }
        };

        // User send message to other partner
        $scope.sendMessage = function(){
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            var bubbleSpeech = null;
            if(currentUser.role == 1)
                bubbleSpeech = 'docSpeech';
            else
                bubbleSpeech = 'patSpeech';

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

            ctrl.ready(function(){
                console.log($rootScope.currentUser.username + " Video Ready!!")

            });
            ctrl.receive(function(session){

                session.connected(function(session) {
                    $timeout(function(){
                        session.video.className += "videoBlock";
                        videoBox.appendChild(session.video);
                        $scope.video = true;
                    })
                });
                session.ended(function(session) {
                    $timeout(function(){
                        $scope.video = false;
                        ctrl.getVideoElement(session.number).remove();
                    })

                });
            });

            ctrl.unable(function(details){
                console.log("Phone is unable to initialize.");
                console.log("Try reloading, or give up.");
            });
        };

        $scope.sendVideo = function(){
            $scope.subcribePhone();
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
        };

        $scope.makeCall = function() {
            console.log('doc call pat');
            var patData = JSON.parse(window.localStorage['patInfo']);
            ctrl.dial(patData['username']);
            console.log('call' + patData['username'])
        };
        
        $scope.endCall = function(){
            $scope.video = false;
            ctrl.hangup();
        };
            
        $scope.addMed = function(){
            $timeout(function(){
                var medicine = {
                    name: $scope.med.medName,
                    quantity: $scope.med.medQuantity
                }
                $scope.medicines.push(medicine);
                $scope.med.medName = '';
                $scope.med.medQuantity = '';
            });

        }
        
        $scope.removeMed = function(index){
            $scope.medicines.splice(index,1);
        }
        
        $scope.finishExam = function(ev){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            $mdDialog.show({
                    locals: {
                        passPat: $scope.patDetails,
                        passPres: $scope.medicines,
                        passChatLog: $scope.chatContent
                    },
                    controller: finishExamController,
                    templateUrl: 'finishExamDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen

                })
                .then(function (answer) {
                }, function () {
                })
                .finally(function(){

                });
        };
        

        // function that is called when user join room
        var loadCurrentContacts = function(){
            pubnub.here_now({
                channel: 'room'+$stateParams.selectedRoom.id,
                state: true,
                callback: function(m) {
                    $scope.loading = true;
                    $scope.roomPatients = [];

                    //get users that already subcribed to channel
                    var contacts = m['uuids'];
                    // get and handle information of each user and push to scope
                    angular.forEach(contacts,function(contact, key){
                        $timeout(function(){
                            contactObj = JSON.parse(contact.uuid);
                            if(contactObj.role == 0)
                            {
                                // Convert date into age
                                var age = new Date().getFullYear() -
                                    contactObj.dateofbirth.substring(0,4);
                                contactObj.age = age;

                                // Get slot number
                                var slot = {
                                    user: contactObj.id,
                                    room: localStorage.getItem('chatRoom')
                                };

                                getNumber(slot);

                                // Update contacts list
                                $scope.roomPatients.push(contactObj)
                            }
                            if(contactObj.role == 1)
                            {
                                $scope.online = true;
                                if(contacts.length == 1)
                                    $scope.nextSlot = 0
                            }
                        })
                    });

                    $scope.loading = false;

                }
            });
        };

        var updateUserJoinRoom = function(user){
            $timeout(function(){
                $scope.loading = true;
                contactObj = JSON.parse(user);
                if(contactObj.role == 0)
                {
                    // Convert date into age
                    var age = new Date().getFullYear() -
                        contactObj.dateofbirth.substring(0,4);
                    contactObj.age = age;

                    // Get slot number
                    var slot = {
                        user: contactObj.id,
                        room: localStorage.getItem('chatRoom')
                    };

                    getNumber(slot);

                    // Update contacts list
                    $scope.roomPatients.push(contactObj)
                }
                if(contactObj.role == 1)
                    $scope.online = true;

                checkContacts();
                $scope.loading = false;

            })
        };

        var checkContacts = function(){
            if($scope.roomPatients.length == 0)
                $scope.showContacts = false;
            else
                $scope.showContacts = true;
        }
        
        // get slot number
        var getNumber = function(data){

            appointmentServices.getslotnumber(data)
                .then(function(appoint){
                    angular.forEach($scope.roomPatients,function(value,key){
                        if(value.id == data.user){
                            value.slot = appoint.data[0].slot
                        }
                        if(currentUser.role == 0){
                            if(currentUser.id == value.id)
                                $scope.yourSlot = value.slot;
                        }
                    });
                    filterSlot()
                },function(e){
                    console.log(e)
                })
        };

        // sort slot number
        var filterSlot = function(){
            if($scope.roomPatients.length != 0){
                var minArr = [];
                angular.forEach($scope.roomPatients,function(value, key){
                    if(value.slot != $scope.currentSlot)
                        minArr.push(value.slot)
                });
                var min = minArr[0];
                if(min == null)
                    $scope.nextSlot = 0;
                else{
                    angular.forEach(minArr,function(value, key){
                        if(value < min)
                            min = value
                        
                    });
                    $scope.nextSlot = min;
                }
            }
            else{
                $scope.nextSlot = 0;
            }
        };

        // function that is called when user leave room or close browser ( timeout )
        var leaveRoomTimeout = function(user){
            if(pubnub.get_uuid() == user){
                console.log(pubnub.get_uuid())
                pubnub.unsubscribe({
                    channel : 'room'+$stateParams.selectedRoom.id
                });
            }
            angular.forEach($scope.roomPatients,function(value, key){
                if(value.username == user.username){
                    $timeout(function(){
                        $scope.roomPatients.splice(key,1);
                        if(value.role == 1)
                            $scope.online = false;
                        console.log(value.username + " Has Left Room!!")
                        $timeout(function(){
                            loadCurrentContacts();
                            checkContacts();
                        },2000)
                    })
                }
            });


        };

        var leaveRoom = function(user){
            if(pubnub.get_uuid() == user){
                pubnub.unsubscribe({
                    channel : 'room'+$stateParams.selectedRoom.id
                });
            }
            $scope.nextSlot = 'Loading...';

            angular.forEach($scope.roomPatients,function(value, key){
                if(value.username == user.username){
                    $timeout(function(){
                        $scope.roomPatients.splice(key,1);
                        if(value.role == 1)
                            $scope.online = false;
                        filterSlot();
                        checkContacts();
                        console.log(value.username + " Has Left Room!!")
                    })
                }

            });


        };

        var leaveDoctor = function(user){

            sendRoomMessage({finishExam: true});
            pubnub.unsubscribe({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username
            });

            $timeout(function(){
                $scope.currentSlot = 0;
                $scope.loadChat = true;
                $scope.chatContent = [];
                localStorage.removeItem('patInfo');
                $scope.detailsTab = true;

            });
            console.log(user.username + ' Disconnect');
            if(currentUser.role == 1)
            {
                $scope.docLoadingText = true;
                $scope.video = false;
            }
            if(currentUser.role == 0)
            {
                $scope.patLoadingText = true;
                $scope.video = false;
            }
        };

        var subcribeDoc = function(){
            pubnub.subscribe({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                presence : function(m){
                    var action = m.action;
                    if(action == 'join')
                    {
                        if(currentUser.role == 0)
                        {
                            pubnub.publish({
                                channel : 'room'+$stateParams.selectedRoom.id,
                                message: {
                                    patInfo: currentUser
                                }

                            });
                            $scope.enteredPat = true;
                        }
                    }
                    if(action == 'leave' || action == 'timeout')
                        leaveDoctor(JSON.parse(m['uuid']))
                },
                message : function( message, env, channel ){
                    // RECEIVED A MESSAGE.
                    
                    if(message['videoCall']){
                        console.log('video request');
                        if(currentUser.role == 0){
                            $scope.subcribePhone();
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
                        if(currentUser.role == 1)
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
                    if(currentUser.role == 1){
                        sendRoomMessage({currentSlot: $scope.nextSlot});
                    }
                    $timeout(function(){
                        console.log("Connected to " + $stateParams.selectedRoom.doctor.user.username);

                        $scope.loadChat = false;
                        $scope.patLoadingText = false;
                        $scope.docLoadingText = false;
                    });

                },
                disconnect : function(){
                    if(currentUser.role == 1)
                    {
                        console.log("Disconnected");
                        alert('Internet is Disconnected')
                        $scope.loadChat = true;
                        $scope.docLoadingText = true;
                    }
                    if(currentUser.role == 0)
                    {
                        console.log("Disconnected");
                        alert('Internet is Disconnected')
                        $scope.loadChat = true;
                        $scope.patLoadingText = true;
                    }

                },
                reconnect : function(){
                    console.log("Reconnected")
                    $scope.loadChat = false;
                    $scope.patLoadingText = false;
                    $scope.docLoadingText = false;
                },
                error : function(){
                    console.log("Network Error")
                }
            })
        };

        var subcribeRoom = function(){
            console.log('Subcribing Room.....');
            try{
                localStorage.setItem('chatRoom',$stateParams.selectedRoom.id);
                pubnub.subscribe({
                    channel : 'room'+$stateParams.selectedRoom.id,

                    // heart beat get user's state for every 10 seconds
                    heartbeat : 13,
                    heartbeat_interval: 6,

                    // handle user's action
                    presence : function(m){
                        var action = m.action;
                        if(action == 'join')
                        {
                            updateUserJoinRoom(m.uuid);
                            if(currentUser.role == 1)
                            {
                                if(localStorage.getItem('patInfo'))
                                    sendRoomMessage({currentSlot: $scope.currentSlot});
                                else
                                    sendRoomMessage({currentSlot: 0});

                            }

                        }
                        if(action == 'timeout')
                            leaveRoomTimeout(JSON.parse(m['uuid']));
                        if(action == 'leave')
                            leaveRoom(JSON.parse(m['uuid']))


                    },
                    message : function( message, env, channel ){
                        // RECEIVED A MESSAGE.
                        $timeout(function() {

                            if(message['patInfo']){
                                if(currentUser.role == 1){
                                    $timeout(function(){
                                        window.localStorage['patInfo'] = angular.toJson(message['patInfo']);
                                        patientServices.findByUserWithUser(message['patInfo'].id)
                                            .then(function(pat){
                                                $scope.patDetails = pat.data[0];
                                                var age = new Date().getFullYear() -
                                                    pat.data[0].dateofbirth.substring(0,4);
                                                $scope.patDetails.age = age;
                                            },function(e){
                                                console.log(e);
                                            })

                                        $scope.detailsTab = false;
                                    });
                                }
                            }
                            
                            if(message['joinMessenger'])
                            {
                                if(currentUser.role == 0)
                                {
                                    angular.forEach($scope.roomPatients,function(value, key){
                                        if(value.username == currentUser.username)
                                        {
                                            if($scope.nextSlot == value.slot)
                                            {
                                                $scope.currentSlot = value.slot;
                                                subcribeDoc();
                                                sendRoomMessage({currentSlot: value.slot});
                                                $mdToast.show($mdToast.simple().textContent('You are now connecting with Doctor!'));
                                            }
                                        }
                                    })

                                }
                            }
                            
                            if(message['currentSlot']){
                                    if(currentUser.role == 1)
                                    {
                                        $scope.loadChat = false;
                                        $scope.patLoadingText = false;
                                        $scope.docLoadingText = false;
                                        $scope.currentSlot = message['currentSlot'];
                                        $timeout(function(){
                                            filterSlot();
                                        });
                                        $mdToast.show($mdToast.simple().textContent('You are now connecting with Patient !'));
                                    }
                                    if(currentUser.role == 0){
                                        $scope.currentSlot = message['currentSlot']
                                        $timeout(function(){
                                            filterSlot();
                                        });
                                    }

                            }

                            if(message['finishExam']){
                                $timeout(function(){
                                    $scope.currentSlot = 0;
                                })
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
                    }
                })
            }catch(e){
                $state.go('room.manageRoom')
            }
        };

        var sendRoomMessage = function(msg){
            pubnub.publish({
                channel : 'room'+$stateParams.selectedRoom.id,
                message: msg,
                callback: function(m){
                    console.log(msg)
                }
            });
        };

        var sendDocMessage = function(msg){
            pubnub.publish({
                channel : 'doc'+$stateParams.selectedRoom.doctor.user.username,
                message: msg,
                callback : function(m){
                    console.log(m)
                }
            });
        }

        function finishExamController($scope,$mdDialog,$rootScope,$filter,
                                           roomServices,$mdToast,passPat,passPres,passChatLog){
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            
            $timeout(function(){
                $scope.medicines = passPres;
                $scope.patDetails = passPat;
            });

            $scope.checkPres = function() {
                if (passPres.length != 0)
                    $scope.showPres = true;
                else
                    $scope.showPres = false;

            }
            
            
            $scope.saveExam = function(){
                angular.forEach(passChatLog,function(value, key){
                    delete value['bubble'];
                    delete value['$$hashKey'];
                })
                console.log(JSON.stringify(passChatLog))
            }
        }
      

        

    }]);