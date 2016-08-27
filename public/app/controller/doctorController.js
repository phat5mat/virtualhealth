var app = angular.module('mainApp');

app.controller('doctorController',['$scope','$http','$window','doctorServices','$mdToast','$timeout'
     , function($scope, $http, $window, doctorServices,$mdToast,$timeout) {
var upId = null;
     $scope.loading = true;

        doctorServices.get()
            .success(function(docData) {
                $scope.doctors = docData;
                $scope.loading = false;
            });

        var pubnub = new PUBNUB({
            publish_key   : 'pub-c-3074e899-a4e2-401c-8fa3-5007d7e7ff06',
            subscribe_key : 'sub-c-b73974e4-65c7-11e6-b99b-02ee2ddab7fe',
            uuid: JSON.parse(localStorage.getItem('user'))['username'],
            ssl: true
        })

        $scope.chatContent = [];
        var videoBox = document.getElementById("videoBox");


     $scope.doctorDetails = function(){
         $scope.doctor = {
             name: null,
             email: null,
             phone: null,
             balance: null,
             dateofbirth: null
         }

         var user = JSON.parse(localStorage.getItem('user'));
         $scope.doctor.name = user['name'];
         $scope.doctor.email = user['email'];
         $scope.doctor.phone = user['phone'];
         $scope.doctor.balance = user['balance'];
         $scope.doctor.dateofbirth = user['dateofbirth'];

     }


     $scope.saveDoc = function() {
            $scope.loading = true;
         doctorServices.save($scope.doctor)
                .success(function(data) {

                    docServices.get()
                        .success(function(docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function(e) {
                    console.log(e);
                });
        };


     $scope.removeDoc = function(id) {
            $scope.loading = true;
         doctorServices.destroy(id)
                .success(function(data) {
                    docServices.get()
                        .success(function(docData) {
                            $scope.doctors = docData;
                            $scope.loading = false;
                        });
                })
                .error(function(e) {
                console.log(e);
                });
        };


     $scope.fillUpdate = function(upDoc){
         upId = upDoc['docid'];
         $scope.doctor = {
             docname: upDoc['docname'],
             docid: upDoc['docid'],
             docphone: upDoc['docphone'],
             docemail: upDoc['docemail'],
             docpassword: upDoc['docpassword'],
         }
     }


     $scope.updateDoc = function(){
         doctorServices.update(upId,$scope.doctor)
             .success(function (data) {
                 docServices.get()
                     .success(function(docData) {
                         $scope.doctors = docData;
                         $scope.loading = false;
                     });
             })
             .error(function(e) {
                 console.log(e);
             });
     }


     $scope.subcribe = function(){
           console.log('Subcribing.....')

           pubnub.subscribe({
               channel : $scope.roomName,
               message : function( message, env, channel ){
                   // RECEIVED A MESSAGE.
                   console.log(message)
                   $timeout(function() {
                       $scope.chatContent.push(message['textMessage']);
                   });
               },
               connect : function(){
                   console.log("Connected")
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