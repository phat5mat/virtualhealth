var app = angular.module('mainApp');

app.controller('manageExamController', ['$scope', '$http', '$window', 'doctorServices', '$mdToast', '$timeout', 'patientServices',
    '$stateParams', '$state', '$rootScope', 'userServices', 'appointmentServices', '$mdDialog', '$mdMedia',
    'examinationServices','downloadServices'
    , function ($scope, $http, $window, doctorServices, $mdToast, $timeout, patientServices, $stateParams,
                $state, $rootScope, userServices, appointmentServices, $mdDialog, $mdMedia, 
                examinationServices,downloadServices) {

        $scope.examDocList = [];
        // Initialize components
        $scope.loadExamination = function () {
            $scope.loading = true;
            examinationServices.getExamByPatient($rootScope.patUser.id)
                .then(function (exam) {
                    $scope.examList = exam.data;
                    if($scope.examList.length == 0){
                        $scope.noExam = true;
                        $scope.loading = false;
                    }else{
                        angular.forEach($scope.examList, function (value, key) {
                            value.examination.date = new Date(value.examination.date);
                        })
                        $scope.loading = false;
                    }
                }, function (e) {
                    console.log(e)
                })
        };

        $scope.selectExam = function (examDetails) {
            $state.go('examDetails', {selectedExam: examDetails})
            console.log(examDetails)

        };

        var $table = $('table.scroll'),
            $bodyCells = $table.find('tbody tr:first').children(),
            colWidth;

// Adjust the width of thead cells when window resizes
        $(window).resize(function() {
            // Get the tbody columns width array
            colWidth = $bodyCells.map(function() {
                return $(this).width();
            }).get();

            // Set the width of thead columns
            $table.find('thead tr').children().each(function(i, v) {
                $(v).width(colWidth[i]);
            });
        }).resize(); // Trigger resize handler

        $scope.loadExamDetails = function () {
            try{
                $scope.medicines = [];
                var selectedExam = $stateParams.selectedExam;
                $scope.patDetails = selectedExam.patient;
                $scope.doctorExam = selectedExam.room.doctor;
                $scope.roomExam = selectedExam.room;
                $scope.exam = selectedExam.examination;
                $scope.exam.date = new Date($scope.exam.date);
                $scope.condition = selectedExam.condition;

                var age = new Date().getFullYear() -
                    selectedExam.patient.user.dateofbirth.substring(0, 4);
                $scope.patDetails.age = age;
                var log = JSON.parse(selectedExam.examination.logs);
                $timeout(function () {
                    if (log.length > 0)
                        $scope.showDownloadBtn = true;
                    else
                        $scope.showDownloadBtn = false;
                });
                $scope.medicines = selectedExam.examination.prescription.drug;

            }catch(e){
                console.log(e)
            }


        };
        
        $scope.downLog = function () {
            var selectedExam = $stateParams.selectedExam;
            var log = JSON.parse(selectedExam.examination.logs);
            var datefile = new Date(selectedExam.room.startDate);
            var day = datefile.getUTCDate();
            var month = datefile.getUTCMonth() + 1;
            var year = datefile.getUTCFullYear();
            var filename = 'Examination Log(' + day + '-' +
                month + "-" + year + ").txt";
            var chatLog = '';

            angular.forEach(log, function (value, key) {
                var dateChat = new Date(value.sentDate);
                var content = value.userName + ' (' + dateChat.getHours() + ":" + dateChat.getMinutes()
                    + "): " + value.textMessages + "\r\n";
                chatLog += content;
            });

            var blob = new Blob([chatLog],{'type':"application/octet-stream"});
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else {
                var file = window.document.createElement('a');
                file.href = window.URL.createObjectURL(blob);
                file.download = filename;
                document.body.appendChild(file);
                file.click();
                document.body.removeChild(file);
            }
        };


        $scope.loadExamByDoctor = function () {
            examinationServices.getExamByDoctor($rootScope.docUser.doctor.id)
                .then(function (response) {
                    angular.forEach(response.data, function (room, key) {
                        if (room.appointment.length > 1) {
                            console.log(room)
                            angular.forEach(room.appointment, function (appoint, appkey) {
                                if (appoint.examination != null)
                                {
                                    appoint.examination.date = new Date(appoint.examination.date);
                                    appoint.examination.spec = room.speciality.name;
                                    appoint.room = room;
                                    $scope.examDocList.push(appoint);
                                }
                            })
                        } else {
                            if (room.appointment[0] != null && room.appointment[0].examination != null)
                            {
                                console.log(room)
                                room.appointment[0].examination.date =
                                    new Date(room.appointment[0].examination.date);
                                room.appointment[0].examination.spec = room.speciality.name;
                                room.appointment[0].room = room;

                                $scope.examDocList.push(room.appointment[0]);
                            }
                        }
                    });
                }, function (e) {
                    console.log(e)
                })
        }

    }]);