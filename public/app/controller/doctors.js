var app = angular.module('doctorRecords', [])
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/v1/');

app.controller('DoctorsController', function($scope, $http, API_URL) {
    //retrieve employees listing from API
    $http.get(API_URL + "doctor").success(function (response) {
            $scope.doctors = response;
        });

    $scope.saveDoc = function(){
        $http({
            method: 'POST',
            url: API_URL + "doctor",
            data:  $.param($scope.doctor),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(response) {
            $scope.doctors.push($scope.doctor);
        }).error(function(response) {
            console.log($scope.doctor);
            alert('This is embarassing. An error has occured. Please check the log for details');
        });
    };

    $scope.removeDoc = function(id){
        $http({
            method: 'DELETE',
            url: API_URL + "doctor/" + id
        }).success(function (response){
            location.reload();
        }).error(function (response){
            alert('Can not Delete');
        })
    }

})

