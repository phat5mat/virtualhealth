<!DOCTYPE html>
<html ng-app="mainApp">
<head>
    <title>Virtual Healthcare</title>
    <meta charset="utf-8">

    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" href="app/css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="app/css/signin.css">
    <link rel="stylesheet" href="../bower_components/angular-material/angular-material.css">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/custom.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'app/template/navbar.html'" ng-controller="authController" ></div>
</head>
<body>

<div class="ng-cloak" ui-view></div>

<script src="app/js/jquery.min.js"></script>
<script src="node_modules/angular/angular.js"></script>
<script src="../bower_components/angular-aria/angular-aria.js"></script>
<script src="../bower_components/angular-animate/angular-animate.js"></script>
<script src="../bower_components/angular-material/angular-material.js"></script>
<script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
<script src="node_modules/satellizer/dist/satellizer.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
<script src="app/js/ui-bootstrap-tpls-2.0.0.js"></script>
<script src="https://cdn.pubnub.com/pubnub-3.7.14.min.js"></script>
<script src="https://cdn.pubnub.com/webrtc/webrtc.js"></script>


<script src="app/controller/app.js"></script>
<script src="app/controller/authController.js"></script>
<script src="app/controller/userController.js"></script>
<script src="app/controller/roomController.js"></script>
<script src="app/controller/patientController.js"></script>
<script src="app/controller/doctorController.js"></script>
<script src="app/controller/staffController.js"></script>
<script src="app/controller/examController.js"></script>
<script src="app/js/services/userServices.js"></script>
<script src="app/js/services/patientServices.js"></script>
<script src="app/js/services/doctorServices.js"></script>
<script src="app/js/services/facultyServices.js"></script>
<script src="app/js/services/roomServices.js"></script>
<script src="app/js/services/appointmentServices.js"></script>
</body>

</html>