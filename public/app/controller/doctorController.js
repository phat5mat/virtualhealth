var app = angular.module('mainApp');

app.controller('doctorController',['$scope','$http','$window','doctorServices','$mdToast'
     , function($scope, $http, $window, doctorServices,$mdToast) {
var upId = null;
     $scope.loading = true;


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

     doctorServices.get()
            .success(function(docData) {
                $scope.doctors = docData;
                $scope.loading = false;
            });


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

    

    }]);