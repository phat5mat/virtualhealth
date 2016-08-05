var mainApp = angular.module('doctorApp', ['doctorServices']);

 mainApp.controller('doctorController', function($scope, $http, $window,  docServices) {
var upId = null;
     $scope.loading = true;
     docServices.get()
            .success(function(docData) {
                $scope.doctors = docData;
                $scope.loading = false;
            });


     $scope.saveDoc = function() {
            $scope.loading = true;
            docServices.save($scope.doctor)
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
            docServices.destroy(id)
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
         docServices.update(upId,$scope.doctor)
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

     $scope.goManageDoc = function(){
         $window.location.href = 'http://localhost/VirtualHealth/public/api/manageDoc';
     }

    });