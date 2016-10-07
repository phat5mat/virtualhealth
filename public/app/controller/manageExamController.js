var app = angular.module('mainApp');

app.controller('manageExamController',['$scope','$http','$window','doctorServices','$mdToast','$timeout','patientServices',
    '$stateParams','$state','$rootScope','userServices','appointmentServices','$mdDialog','$mdMedia',
    'examinationServices'
    , function($scope, $http, $window, doctorServices,$mdToast,$timeout,patientServices,$stateParams,
               $state,$rootScope,userServices,appointmentServices,$mdDialog,$mdMedia,examinationServices) {

        // Initialize components
        $scope.loadExamination = function(){
            examinationServices.getExamByPatient($rootScope.patUser.id)
                .then(function(exam){
                    $scope.examDetails = exam.data;
                    angular.forEach($scope.examDetails,function(value,key){
                        value.examination.date = new Date(value.examination.date);
                    })
                },function(e){
                    console.log(e)
                })
        };

        $scope.selectExam = function(examDetails){
            $state.go('examDetails',{selectedExam: examDetails})
        }

        $scope.loadExamDetails = function(){
            var selectedExam = $stateParams.selectedExam;
            console.log(selectedExam)
            $scope.patDetails = selectedExam.patient;
            $scope.medicines = selectedExam.examination.prescription.drug;
            $scope.examResult = selectedExam.examination.result;
            var age = new Date().getFullYear() -
                selectedExam.patient.user.dateofbirth.substring(0,4);
            $scope.patDetails.age = age
        };

        $scope.downLog = function(){
            var selectedExam = $stateParams.selectedExam;
            var log = JSON.parse(selectedExam.examination.logs);
            var datefile = new Date(selectedExam.room.startDate);
            var day = datefile.getUTCDate();
            var month = datefile.getUTCMonth() + 1;
            var year = datefile.getUTCFullYear();
            var filename = 'Examination Log(' + day + '-' +
                month+"-"+year+").txt";
            var chatLog = '';

            angular.forEach(log,function(value, key){
                var dateChat = new Date(value.sentDate);
                var content = value.userName + ' (' + dateChat.getHours()+":"+dateChat.getMinutes()
                + "): " + value.textMessages + "\r\n";
                chatLog += content;
            });

            var blob = new Blob([chatLog], {type: 'text/csv'});
            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else{
                var file = window.document.createElement('a');
                file.href = window.URL.createObjectURL(blob);
                file.download = filename;
                document.body.appendChild(file);
                file.click();
                document.body.removeChild(file);
            }
        }

    }]);