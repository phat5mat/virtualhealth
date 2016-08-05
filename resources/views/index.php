<!DOCTYPE html>
<html ng-app="authMain">
<head>
    <title>Virtual Healthcare</title>
    <meta charset="utf-8">

    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" href="app/css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="app/css/signin.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'app/template/navbar.html'" ng-controller="authController" ></div>
</head>
<body >
<h1 class="text-center"> WELCOME TO VIRTUAL HEALTHCARE </h1>

<div ui-view></div>
</body>

<script src="app/js/jquery.min.js"></script>
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
<script src="node_modules/satellizer/dist/satellizer.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>


<script src="app/controller/app.js"></script>
<script src="app/controller/authController.js"></script>
<script src="app/controller/userController.js"></script>
<script src="app/js/services/userServices.js"></script>
<script src="app/js/services/facultyServices.js"></script>

</html>