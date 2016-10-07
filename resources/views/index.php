<!DOCTYPE html>
<html ng-app="mainApp">
<head>
    <title>Virtual Healthcare</title>
    <meta charset="utf-8">

    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" href="app/css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="app/css/signin.css">
    <link rel="stylesheet" href="../bower_components/angular-material/angular-material.css">
    <link rel="stylesheet" href="../bower_components/angular-responsive-tables/release/angular-responsive-tables.css">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/custom.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'app/template/navbar.html'" ng-controller="authController" ></div>
</head>
<body>
<div class="container">
    <div class="ng-cloak" ui-view></div>
</div>
<script src="app/js/jquery.min.js"></script>
<script src="node_modules/angular/angular.js"></script>
<script src="../bower_components/angular-aria/angular-aria.js"></script>
<script src="../bower_components/angular-smart-table/dist/smart-table.js"></script>
<script src="../bower_components/angular-animate/angular-animate.js"></script>
<script src="../bower_components/angular-material/angular-material.js"></script>
<script src="../bower_components/angular-messages/angular-messages.js"></script>
<script src="../bower_components/ng-file-upload/ng-file-upload.js"></script>
<script  src="../bower_components/footable/js/footable.js"></script>
<script  src="../bower_components/angular-footable/dist/angular-footable.js"></script>
<script  src="../bower_components/angular-responsive-tables/release/angular-responsive-tables.js"></script>

<script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
<script src="node_modules/satellizer/dist/satellizer.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
<script src="app/js/ui-bootstrap-tpls-2.0.0.js"></script>
<script src="node_modules/angular/pubnub-3.16.1.js"></script>
<script src="node_modules/angular/webrtc.js"></script>
<script src="node_modules/angular/rtc-controller.js"></script>

<script src="app/controller/app.js"></script>
<script src="app/controller/authController.js"></script>
<script src="app/controller/userController.js"></script>
<script src="app/controller/roomController.js"></script>
<script src="app/controller/patientController.js"></script>
<script src="app/controller/doctorController.js"></script>
<script src="app/controller/staffController.js"></script>
<script src="app/controller/examController.js"></script>
<script src="app/controller/manageExamController.js"></script>

<script src="app/js/services/userServices.js"></script>
<script src="app/js/services/patientServices.js"></script>
<script src="app/js/services/doctorServices.js"></script>
<script src="app/js/services/facultyServices.js"></script>
<script src="app/js/services/roomServices.js"></script>
<script src="app/js/services/appointmentServices.js"></script>
<script src="app/js/services/examinationServices.js"></script>
<script src="app/js/services/uploadServices.js"></script>


</body>

</html>