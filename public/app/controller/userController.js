/**
 * Created by REN on 7/28/2016.
 */
var mainApp = angular.module('userApp', []);

mainApp.controller('userController', function($scope, $location,
                                              $http, $window, userServices,
                                              facultyServices ,$filter) {
    var upId = null;
    

    $scope.showPatForm = function(){
        $scope.patForm = true;
        $scope.selectRole = false;
    }
    
    $scope.showDocForm = function(){
        $scope.docForm = true;
        $scope.selectRole = false;

    }

    $scope.backForm = function(){
        $scope.docForm = false;
        $scope.patForm = false;
        $scope.selectRole = true;
    }

    facultyServices.get().success(function(facData){
        $scope.facList = facData;
    }).error(function(e){
        console.log('get Fac Error');
    });

    $scope.register = function() {
        $scope.loading = true;
        $date = $filter('date')($scope.user.dateinput, 'yyyy-MM-dd');
        $scope.user.dateofbirth = $date;
        userServices.save($scope.user)
            .success(function(data) {
                userServices.get()
                    .success(function(userData) {
                        $scope.patForm = false;
                        $scope.docForm = false;
                        $scope.successPage = true;
                    });
            })
            .error(function(e) {
                console.log($scope.user);
            });
    };


    $scope.removeUser = function(id) {
        $scope.loading = true;
        userServices.destroy(id)
            .success(function(data) {
                docServices.get()
                    .success(function(userData) {
                        console.log('Success');
                    });
            })
            .error(function(e) {
                console.log(e);
            });
    };


    $scope.fillUserUpdate = function(upUser){
        upId = upUser['docid'];
        $scope.user = {
            name: upUser['name'],
            password: upUser['password'],
            phone: upUser['phone'],
            email: upUser['email'],
        }
    }

    $scope.updateUser = function(){
        userServices.update(upId,$scope.doctor)
            .success(function (data) {
                docServices.get()
                    .success(function(userData) {
                        console.log('Success');
                    });
            })
            .error(function(e) {
                console.log(e);
            });
    }


    $scope.goLogin = function(){
        $window.location.href = 'http://localhost/VirtualHealth/public/login';

    }
});