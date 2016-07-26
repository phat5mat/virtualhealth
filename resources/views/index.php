<!DOCTYPE html>
<html lang="en-US" ng-app="doctorApp" ng-controller="mainController">
<head>
    <title>Laravel 5 AngularJS CRUD Example</title>

    <link rel="stylesheet" href="<?= asset('app/css/bootstrap.min.css') ?>">
    <link rel="stylesheet" href="<?= asset('app/css/font-awesome/css/font-awesome.min.css') ?>">

    <meta name="csrf-token" content="{{ csrf_token() }}">
<div ng-include="'template/navbar.html'" ></div>
</head>
<body>
<h1> WELCOME TO VIRTUAL HEALTHCARE </h1>
</body>

<footer>

</footer>
<script src="<?= asset('app/js/jquery.min.js') ?>"></script>
<script src="<?= asset('app/libs/angular/angular.min.js') ?>"></script>
<script src="<?= asset('app/js/bootstrap.min.js') ?>"></script>
<script src="<?= asset('app/js/ui-bootstrap-tpls-2.0.0.js') ?>"></script>
<script src="<?= asset('app/controller/mainController.js') ?>"></script>
<script src="<?= asset('app/js/services/doctorServices.js') ?>"></script>
<script src="<?= asset('app/js/app.js') ?>"></script>
</html>