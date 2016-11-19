var app = angular.module('mainApp');

app.controller('examController', ['$scope', '$http', '$window', 'doctorServices', '$mdToast', '$timeout', 'patientServices',
    '$stateParams', '$state', '$rootScope', 'userServices', 'appointmentServices', '$mdDialog', '$mdMedia',
    'examinationServices','roomServices'
    , function ($scope, $http, $window, doctorServices, $mdToast, $timeout, patientServices, $stateParams,
                $state, $rootScope, userServices, appointmentServices, $mdDialog,
                $mdMedia, examinationServices,roomServices) {

            // Initialize components
            var currentUser = JSON.parse(localStorage.getItem('user'));
            $scope.roomPatients = [];
            $scope.chatContent = [];
            $scope.medicines = [];
            var contactObj = null;
            $scope.detailsTab = true;
            var videoBox = document.getElementById("videoBox");
            var localVideo = document.getElementById("localVideoBox");
            $scope.nextSlot = 0;
            $scope.currentSlot = 0;
            $scope.loading = true;
            $scope.med = {
                medName: '',
                medQuantity: ''
            };

            if (currentUser.role == 0) {
                $scope.patLoadingText = true;
                $scope.docLoadingText = false;
            }
            else {
                $scope.docLoadingText = true;
                $scope.patLoadingText = false;
            }


            if (!$rootScope.alreadySubscribed) {
                console.log('subscribing....');
                // Initialize pubnub object which interact pubnub cloud server
                pubnub = new PUBNUB({
                    publish_key: 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
                    subscribe_key: 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
                    uuid: currentUser,
                    ssl: true
                });

                phone = window.phone = PHONE({
                    number: $rootScope.currentUser.username, // listen on username line else Anonymous
                    publish_key: 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06', // Your Pub Key
                    subscribe_key: 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe' // Your Sub Key
                });

                ctrl = window.ctrl = CONTROLLER(phone);
                $rootScope.alreadySubscribed = true;

            }



        // Load information of room
        $scope.loadRoomDetails = function () {
            $scope.roomDetails2 = $stateParams.selectedRoom;

        };

        // Load all patients that has make an appointment with room
        $scope.loadRoomPatients = function () {
            if (!localStorage.getItem('selectRoom')) {
                try {
                    localStorage.setItem('selectRoom', $stateParams.selectedRoom.id);
                    patientServices.findByRoom($stateParams.selectedRoom.id)
                        .then(function (patientsData) {
                            $scope.roomPatients = patientsData.data;
                            angular.forEach($scope.roomPatients, function (user, key) {
                                var age = new Date().getFullYear() -
                                    $scope.roomPatients[key].patient.user.dateofbirth.substring(0, 4);
                                $scope.roomPatients[key].patient.user.age = age
                            });
                            $scope.loading = false;
                        }, function (e) {
                            console.log(e)
                        });
                    localStorage.removeItem('selectRoom');
                }
                catch (e) {
                    $state.go('room.manageRoom')
                }
            }
        };

        // Load information of room doctor
        $scope.loadRoomDoctor = function () {
            try {
                $scope.roomDoctor = $stateParams.selectedRoom.doctor
            }
            catch (e) {
                if (currentUser.role == 1)
                    $state.go('room.manageRoom');
                else
                    $state.go('appoint')
            }
        };

        // User subcribe to room channel when they enter the room 
        $scope.subcribe = function () {
            try {
                subcribeRoom();
                $timeout(function () {
                    loadCurrentContacts();
                    checkContacts();
                }, 2000)

            }
            catch (e) {
                if (currentUser.role == 1)
                    $state.go('room.manageRoom');
                else
                    $state.go('appoint')

            }
        };

        // Invite next patient to begin examination
        $scope.connectNext = function () {
            if ($scope.roomPatients.length == 0) {
                $mdToast.show($mdToast.simple().textContent('There is no any patient in room'));
            } else {
                try {
                    console.log('Subcribing Doctor.....');
                    subcribeDoc();
                    sendRoomMessage({joinMessenger: true});

                } catch (e) {
                    $state.go('room.manageRoom')
                }
            }
        };

        // User send message to other partner
        $scope.sendMessage = function () {
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }
            var bubbleSpeech = null;
            if (currentUser.role == 1)
                bubbleSpeech = 'docSpeech';
            else
                bubbleSpeech = 'patSpeech';

            pubnub.publish({
                channel: 'doc' + $stateParams.selectedRoom.doctor.user.username,
                message: {
                    textMessages: $scope.messageContent,
                    userName: currentUser.name,
                    sentDate: new Date(),
                    bubble: bubbleSpeech
                },
                callback: function (m) {
                    console.log("sent to " + $stateParams.selectedRoom.doctor.user.username)
                }
            });
            $scope.messageContent = '';


        };

        // User subcribe to video call function channel and enable webcam device
        $scope.subcribePhone = function () {

            ctrl.ready(function () {
                console.log($rootScope.currentUser.username + " Video Ready!!")

            });
            ctrl.receive(function (session) {

                session.connected(function (session) {
                    $timeout(function () {
                        session.video.className += "videoBlock";
                        videoBox.appendChild(session.video);
                        $scope.video = true;
                    })
                });
                session.ended(function (session) {
                    $timeout(function () {
                        $scope.video = false;
                        ctrl.getVideoElement(session.number).remove();
                    })

                });
            });

            ctrl.unable(function (details) {
                console.log("Phone is unable to initialize.");
                console.log("Try reloading, or give up.");
            });
        };

        // Subcribe to video call channel and send request video to patient
        $scope.sendVideo = function () {
            $scope.subcribePhone();
            if (currentUser.role == 1) {
                pubnub.publish({
                    channel: 'doc' + $stateParams.selectedRoom.doctor.user.username,
                    message: {
                        videoCall: true
                    },
                    callback: function (m) {
                        console.log(m)
                    }
                });
            }
        };

        // Make a call to partner
        $scope.makeCall = function () {
            console.log('doc call pat');
            var patData = JSON.parse(window.localStorage['patInfo']);
            ctrl.dial(patData['username']);
            console.log('call' + patData['username'])
        };

        // End current video call session
        $scope.endCall = function () {
            $scope.video = false;
            ctrl.hangup();
        };

        // Add medicine into prescription
        $scope.addMed = function () {
            $timeout(function () {
                var medicine = {
                    name: $scope.med.medName,
                    quantity: $scope.med.medQuantity
                };
                $scope.medicines.push(medicine);
                $scope.showPres = true;
                $scope.med.medName = '';
                $scope.med.medQuantity = '';
            });

        };

        // Remove selected medicine from prescription
        $scope.removeMed = function (index) {
            $scope.medicines.splice(index, 1);
            if($scope.medicines.length == 0)
                $scope.showPres = false;
        };

        // Show examination review dialog
        $scope.showReviewExamDialog = function (ev) {

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
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function (answer) {
                    if (answer == true) {
                        sendDocMessage({finishExam: true});
                    }
                })

        };

        $scope.closeRoom = function(){
            if($scope.showContacts == true){
                $mdDialog.show({
                        locals: {
                            passPat: $scope.roomPatients,
                            passRoom: $stateParams.selectedRoom.name
                        },
                        controller: closeRoomDialogController,
                        templateUrl: 'closeRoomDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true
                    })
                    .then(function () {
                        roomServices.updateStatus($stateParams.selectedRoom.id,3)
                            .then(function(response){
                                appointmentServices.updateStatus($stateParams.selectedRoom.id,3)
                                    .then(function(){
                                        sendRoomMessage({closeRoom: true});
                                        $mdToast.show($mdToast.simple().textContent('Room is closed'));
                                        $state.go('room.manageRoom')
                                    });
                            })
                    }, function () {

                    })
            }else{
                var confirm = $mdDialog.confirm()
                    .title('Are you sure to close this Room??')
                    .textContent('Please choose your option.')
                    .ok('Accept')
                    .cancel('Reject');

                $mdDialog.show(confirm).then(function () {
                    roomServices.updateStatus($stateParams.selectedRoom.id,3)
                        .then(function(response){
                            appointmentServices.updateStatus($stateParams.selectedRoom.id,3)
                                .then(function(){
                                    $mdToast.show($mdToast.simple().textContent('Room is closed'));
                                    $state.go('room.manageRoom')
                                });
                        })
                }, function () {

                });
            }
            
        };
        
        $scope.showHealth = function(){
            $mdDialog.show({
                    locals: {
                        passPat: $scope.roomPatients,
                        passRoom: $stateParams.selectedRoom.name
                    },
                    controller: healthStatisticController,
                    templateUrl: 'healthStatistic.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                })
                .then(function () {
                    roomServices.updateStatus($stateParams.selectedRoom.id,2)
                        .then(function(response){
                            appointmentServices.updateStatus($stateParams.selectedRoom.id,3)
                                .then(function(){
                                    sendRoomMessage({closeRoom: true});
                                    $mdToast.show($mdToast.simple().textContent('Room is closed'));
                                    $state.go('room.manageRoom')
                                });
                        })
                }, function () {

                })
        };


        // function that is called when user join room
        var loadCurrentContacts = function () {
            pubnub.here_now({
                channel: 'room' + $stateParams.selectedRoom.id,
                state: true,
                callback: function (m) {
                    $scope.loading = true;
                    $scope.roomPatients = [];

                    //get users that already subcribed to channel
                    var contacts = m['uuids'];
                    // get and handle information of each user and push to scope
                    angular.forEach(contacts, function (contact, key) {
                        $timeout(function () {
                            contactObj = JSON.parse(contact.uuid);
                            if (contactObj.role == 0) {
                                // Convert date into age
                                var age = new Date().getFullYear() -
                                    contactObj.dateofbirth.substring(0, 4);
                                contactObj.age = age;

                                // Get slot number
                                var slot = {
                                    user: contactObj.id,
                                    room: localStorage.getItem('chatRoom')
                                };
                                if(contactObj.avatar == 1)
                                    contactObj.avatarSrc =  "assets/img/avatar-" + contactObj.username + ".jpg";
                                else
                                    contactObj.avatarSrc = "assets/img/no-avatar.png";

                                getNumber(slot);

                                // Update contacts list
                                $scope.roomPatients.push(contactObj)
                            }
                            if (contactObj.role == 1) {
                                $scope.online = true;
                                if (contacts.length == 1)
                                    $scope.nextSlot = 0
                            }
                        })
                    });

                    $scope.loading = false;

                }
            });
        };

        // Update contacts list when someone enter room
        var updateUserJoinRoom = function (user) {
            $timeout(function () {
                $scope.loading = true;
                contactObj = JSON.parse(user);
                if (contactObj.role == 0) {
                    // Convert date into age
                    var age = new Date().getFullYear() -
                        contactObj.dateofbirth.substring(0, 4);
                    contactObj.age = age;

                    // Get slot number
                    var slot = {
                        user: contactObj.id,
                        room: localStorage.getItem('chatRoom')
                    };
                    if(contactObj.avatar == 1)
                        contactObj.avatarSrc =  "assets/img/avatar-" + contactObj.username + ".jpg";
                    else
                        contactObj.avatarSrc = "assets/img/no-avatar.png";
                    getNumber(slot);

                    // Update contacts list
                    $scope.roomPatients.push(contactObj)
                }
                if (contactObj.role == 1)
                    $scope.online = true;

                checkContacts();
                $scope.loading = false;

            })
        };

        //Check if contacts has anyone online
        var checkContacts = function () {
            if ($scope.roomPatients.length == 0)
                $scope.showContacts = false;
            else
                $scope.showContacts = true;
        };

        // get slot number
        var getNumber = function (data) {

            appointmentServices.getslotnumber(data)
                .then(function (appoint) {
                    angular.forEach($scope.roomPatients, function (value, key) {
                        if (value.id == data.user) {
                            value.slot = appoint.data[0].slot
                        }
                        if (currentUser.role == 0) {
                            if (currentUser.id == value.id)
                                $scope.yourSlot = value.slot;
                        }
                    });
                    filterSlot()
                }, function (e) {
                    console.log(e)
                })
        };

        // sort slot number
        var filterSlot = function () {
            if ($scope.roomPatients.length != 0) {
                // Array to store minimum number
                var minArr = [];
                // create a loop to check and remove current examination number from waiting number
                angular.forEach($scope.roomPatients, function (value, key) {
                    if (value.slot != $scope.currentSlot)
                        minArr.push(value.slot)
                });
                // get first number of array which is made as an anchor to check minimum number
                var min = minArr[0];
                // if can't find the first number of array that mean there is nobody in waiting list
                if (min == null)
                    $scope.nextSlot = 0;
                else {
                    // check each number to find out minimum slot number and be assigned as next slot number
                    angular.forEach(minArr, function (value, key) {
                        if (value < min)
                            min = value

                    });
                    $scope.nextSlot = min;
                }
            }
            else {
                $scope.nextSlot = 0;
            }
        };

        // function that is called when user leave room or close browser ( timeout )
        var leaveRoomTimeout = function (user) {
            if (pubnub.get_uuid() == user) {
                console.log(pubnub.get_uuid());
                pubnub.unsubscribe({
                    channel: 'room' + $stateParams.selectedRoom.id
                });
            }
            if(user.role == 1){
                $timeout(function(){
                    $scope.online = false;
                });
            }else{
                angular.forEach($scope.roomPatients, function (value, key) {
                    if (value.username == user.username) {
                        $timeout(function () {
                            $scope.roomPatients.splice(key, 1);
                            console.log(value.username + " Has Left Room!!")
                            $timeout(function () {
                                loadCurrentContacts();
                                checkContacts();
                            }, 2000)
                        })
                    }
                });
            }

        };

        // function that is called when user leave room by finish the examination
        var leaveRoom = function (user) {
            if (pubnub.get_uuid() == user) {
                pubnub.unsubscribe({
                    channel: 'room' + $stateParams.selectedRoom.id
                });
            }
            $scope.nextSlot = 'Loading...';

            angular.forEach($scope.roomPatients, function (value, key) {
                if (value.username == user.username) {
                    $timeout(function () {
                        $scope.roomPatients.splice(key, 1);
                        if (value.role == 1)
                            $scope.online = false;
                        filterSlot();
                        checkContacts();
                        console.log(value.username + " Has Left Room!!")
                    })
                }

            });


        };

        // function that is called when user is accidentially close the browser
        var leaveDoctor = function (user) {

            sendRoomMessage({finishExam: true});
            pubnub.unsubscribe({
                channel: 'doc' + $stateParams.selectedRoom.doctor.user.username
            });

            $timeout(function () {
                $scope.currentSlot = 0;
                $scope.loadChat = true;
                $scope.chatContent = [];
                localStorage.removeItem('patInfo');
                $scope.detailsTab = true;

            });
            console.log(user.username + ' Disconnect');
            if (currentUser.role == 1) {
                $scope.docLoadingText = true;
                $scope.video = false;
            }
            if (currentUser.role == 0) {
                $scope.patLoadingText = true;
                $scope.video = false;
            }
        };

        // subcribe to doctor channel to begin examination
        var subcribeDoc = function () {
            pubnub.subscribe({
                channel: 'doc' + $stateParams.selectedRoom.doctor.user.username,
                presence: function (m) {
                    var action = m.action;
                    if (action == 'join') {
                        if (currentUser.role == 0) {
                            sendRoomMessage(
                                {
                                    patInfo: currentUser,
                                    patAppoint: $stateParams.selectedAppoint
                                }
                            )
                            $scope.enteredPat = true;
                        }
                    }
                    if (action == 'leave' || action == 'timeout')
                        leaveDoctor(JSON.parse(m['uuid']))
                },
                message: function (message, env, channel) {
                    // RECEIVED A MESSAGE.

                    if (message['videoCall']) {
                        console.log('video request');
                        if (currentUser.role == 0) {
                            $scope.subcribePhone();
                            var confirm = $mdDialog.confirm()
                                .title('Doctor is calling you!!!')
                                .textContent('Please choose your option.')
                                .ok('Accept')
                                .cancel('Reject');

                            $mdDialog.show(confirm).then(function () {
                                sendDocMessage({videoCallAccept: true});
                            }, function () {
                                sendDocMessage({videoCallReject: true});
                            });
                        }
                    }
                    if (message['videoCallAccept']) {
                        if (currentUser.role == 1)
                            $scope.makeCall()
                    }
                    if (message['videoCallReject']) {
                        $mdToast.show($mdToast.simple().textContent('Video call is rejected'));
                    }

                    if (message['finishExam']) {
                        if (currentUser.role == 1)
                            leaveDoctor(currentUser);
                        if (currentUser.role == 0) {
                            $mdDialog.show({
                                    locals: {
                                        passPat: $scope.roomPatients,
                                        passRoom: $stateParams.selectedRoom.name
                                    },
                                    controller: rateDoctorController,
                                    templateUrl: 'rateDoctor.html',
                                    parent: angular.element(document.body),
                                    clickOutsideToClose: true
                                })
                                .then(function (response) {
                                    if(response.rate != null || response.comment != null){
                                        doctorServices.rateDoctor($stateParams.selectedRoom.doctor.id,response)
                                            .then(function(){
                                                examinationServices.getExamByAppointment($stateParams.selectedAppoint)
                                                    .then(function (exam) {
                                                        leaveDoctor(currentUser);
                                                        leaveRoom(currentUser);
                                                        $timeout(function () {
                                                            $state.go('examDetails', {selectedExam: exam.data[0]});
                                                        }, 1000)
                                                    })
                                            })
                                    }else{
                                        examinationServices.getExamByAppointment($stateParams.selectedAppoint)
                                            .then(function (exam) {
                                                leaveDoctor(currentUser);
                                                leaveRoom(currentUser);
                                                $timeout(function () {
                                                    $state.go('examDetails', {selectedExam: exam.data[0]});
                                                }, 1000)
                                            })
                                    }
                                  
                                })
                            

                        }
                    }
                    $timeout(function () {
                        $scope.chatContent.push(message);
                    });
                },
                connect: function () {
                    if (currentUser.role == 1) {
                        sendRoomMessage({currentSlot: $scope.nextSlot});
                    }
                    $timeout(function () {
                        console.log("Connected to " + $stateParams.selectedRoom.doctor.user.username);

                        $scope.loadChat = false;
                        $scope.patLoadingText = false;
                        $scope.docLoadingText = false;
                    });

                },
                disconnect: function () {
                    if (currentUser.role == 1) {
                        console.log("Disconnected");
                        alert('Internet is Disconnected')
                        $scope.loadChat = true;
                        $scope.docLoadingText = true;
                    }
                    if (currentUser.role == 0) {
                        console.log("Disconnected");
                        alert('Internet is Disconnected')
                        $scope.loadChat = true;
                        $scope.patLoadingText = true;
                    }

                },
                reconnect: function () {
                    console.log("Reconnected")
                    $scope.loadChat = false;
                    $scope.patLoadingText = false;
                    $scope.docLoadingText = false;
                },
                error: function () {
                    console.log("Network Error")
                }
            })
        };

        // subcribe to room channel to assign to contact list
        var subcribeRoom = function () {
            console.log('Subcribing Room.....');
            try {
                localStorage.setItem('chatRoom', $stateParams.selectedRoom.id);
                pubnub.subscribe({
                    channel: 'room' + $stateParams.selectedRoom.id,

                    // heart beat get user's state for every 10 seconds
                    heartbeat: 13,
                    heartbeat_interval: 6,

                    // handle user's action
                    presence: function (m) {
                        var action = m.action;
                        if (action == 'join') {
                            updateUserJoinRoom(m.uuid);
                            if (currentUser.role == 1) {
                                if (localStorage.getItem('patInfo'))
                                    sendRoomMessage({currentSlot: $scope.currentSlot});
                                else
                                    sendRoomMessage({currentSlot: 0});

                            }

                        }
                        if (action == 'timeout')
                        {
                            console.log('timeout' + m['uuid'])
                            leaveRoomTimeout(JSON.parse(m['uuid']));
                        }
                        if (action == 'leave')
                            leaveRoom(JSON.parse(m['uuid']))


                    },
                    message: function (message, env, channel) {
                        // RECEIVED A MESSAGE.
                        $timeout(function () {

                            if (message['patInfo']) {
                                if (currentUser.role == 1) {
                                    $timeout(function () {
                                        window.localStorage['patInfo'] = angular.toJson(message['patInfo']);
                                        localStorage.setItem('patAppoint', message['patAppoint'])
                                        patientServices.findByUserWithUser(message['patInfo'].id)
                                            .then(function (pat) {
                                                $scope.patDetails = pat.data[0];
                                                var age = new Date().getFullYear() -
                                                    pat.data[0].dateofbirth.substring(0, 4);
                                                $scope.patDetails.age = age;
                                                appointmentServices.findbyid(message['patAppoint'])
                                                    .then(function(response){
                                                        var patData = response.data;
                                                        $scope.patDetails.condition = patData.condition;
                                                    })
                                            }, function (e) {
                                                console.log(e);
                                            })

                                        $scope.detailsTab = false;
                                    });
                                }
                            }

                            if (message['joinMessenger']) {
                                if (currentUser.role == 0) {
                                    angular.forEach($scope.roomPatients, function (value, key) {
                                        if (value.username == currentUser.username) {
                                            if ($scope.nextSlot == value.slot) {
                                                $scope.currentSlot = value.slot;
                                                subcribeDoc();
                                                sendRoomMessage({currentSlot: value.slot});
                                                $mdToast.show($mdToast.simple().textContent('You are now connecting with Doctor!'));
                                            }
                                        }
                                    })

                                }
                            }

                            if (message['currentSlot']) {
                                if (currentUser.role == 1) {
                                    $scope.loadChat = false;
                                    $scope.patLoadingText = false;
                                    $scope.docLoadingText = false;
                                    $scope.currentSlot = message['currentSlot'];
                                    $timeout(function () {
                                        filterSlot();
                                    });
                                    $mdToast.show($mdToast.simple().textContent('You are now connecting with Patient !'));
                                }
                                if (currentUser.role == 0) {
                                    $scope.currentSlot = message['currentSlot']
                                    $timeout(function () {
                                        filterSlot();
                                    });
                                }

                            }

                            if (message['finishExam']) {
                                $timeout(function () {
                                    $scope.currentSlot = 0;
                                })
                            }

                            if(message['closeRoom']){
                                if(currentUser.role == 0){
                                    $timeout(function(){
                                        leaveRoom(currentUser);
                                        $state.go('appoint.manageAppointment')
                                    })
                                }

                            }
                        });
                    },

                    connect: function () {
                        //User subcribe to channel successfully
                        console.log("Connected to " + $stateParams.selectedRoom.name)
                    },
                    disconnect: function () {
                        console.log("Disconnected")
                    },
                    reconnect: function () {
                        console.log("Reconnected")
                    },
                    error: function () {
                        console.log("Network Error")
                    }
                })
            } catch (e) {
                $state.go('room.manageRoom')
            }
        };

        // send message to room channel
        var sendRoomMessage = function (msg) {
            pubnub.publish({
                channel: 'room' + $stateParams.selectedRoom.id,
                message: msg,
                callback: function (m) {
                    console.log(msg)
                }
            });
        };

        // send message to doctor channel
        var sendDocMessage = function (msg) {
            pubnub.publish({
                channel: 'doc' + $stateParams.selectedRoom.doctor.user.username,
                message: msg,
                callback: function (m) {
                    console.log(m)
                }
            });
        }

        // controller of examination review dialog
        function finishExamController($scope, $mdDialog, $mdToast, passPat, passPres, passChatLog) {
            $scope.cancel = function () {
                $mdDialog.cancel();
            };


            $timeout(function () {
                $scope.medicines = passPres;
                $scope.patDetails = passPat;
                if($scope.patDetails.avatar == 1)
                    $scope.patDetails.avatarSrc =  "assets/img/avatar-" +  $scope.patDetails.username + ".jpg";
                else
                    $scope.patDetails.avatarSrc = "assets/img/no-avatar.png";
            });

            $scope.checkPres = function () {
                if (passPres.length != 0)
                    $scope.showPres = true;
                else
                    $scope.showPres = false;

            };

            $scope.saveExam = function () {
                $mdDialog.show({
                        skipHide: true,
                        controller: function ($mdDialog, $scope) {
                            $scope.acceptFinish = function (answer) {
                                $mdDialog.hide(answer);
                            };
                        },
                        templateUrl: 'confirmFinish.html'
                    })
                    .then(function (answer) {
                        if (answer == 'true') {
                            angular.forEach(passChatLog, function (value, key) {
                                delete value['bubble'];
                                delete value['$$hashKey'];
                            });

                            var newExam = {
                                chatLog: JSON.stringify(passChatLog),
                                result: $scope.examResult,
                                prescription: passPres,
                                appointment: localStorage.getItem('patAppoint')
                            };

                            examinationServices.save(newExam)
                                .then(function () {
                                    $mdToast.show($mdToast.simple().textContent('Examination is completed!!'));
                                    $mdDialog.cancel(true);
                                }, function () {
                                    console.log(e)
                                })
                        }

                    })
            }
        }

        function closeRoomDialogController($scope, $mdDialog, $mdToast, passPat, passRoom) {
            $scope.cancel = function () {
                $mdDialog.cancel();
            };


            $timeout(function () {
                $scope.patList = passPat;
                $scope.roomName = passRoom;
                $scope.patCount = $scope.patList.length;
            });

            $scope.saveAndCloseRoom = function () {
                $mdDialog.hide();
            }
        }
        
        function healthStatisticController($scope,$mdDialog){
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            
        }

        function rateDoctorController($scope,$mdDialog){
            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $timeout(function(){
                    if(value == 1){
                        $scope.rateDes = 'Terrible';
                    }
                    if(value == 2){
                        $scope.rateDes = 'Bad';
                    }
                    if(value == 3){
                        $scope.rateDes = 'OK';
                    }
                    if(value == 4){
                        $scope.rateDes = 'Good';
                    }
                    if(value == 5){
                        $scope.rateDes = 'Very good';
                    }
                })
            };
            $scope.doneRate = function(){
                $scope.feedback = {
                    rate : $scope.overStar,
                    comment : $scope.comment
                };
                $mdDialog.hide($scope.feedback);
            };
            $scope.doc = $stateParams.selectedRoom.doctor.user.username;
        }


    }]);