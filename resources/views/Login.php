<!DOCTYPE html>
<html lang="en-US" ng-app="userApp" ng-controller="userController">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login</title>
    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" href="app/css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="app/css/signin.css">


    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'app/template/navbar.html'" ></div>

</head>
<body>
<div class="container ">
    <form name="loginForm" class="form-signin">
        <h3 class="form-signin-heading">Login</h3>
        <input ng-model="user.username" class="form-control" required placeholder="Username">
        <input ng-model="user.password" class="form-control" required placeholder="Password">
        <div >
            <button name="submit" ng-disabled="loginForm.$invalid"
                    type="submit" class="btn btn-lg btn-primary btn-block">Log in</button>
        </div>
    </form>
</div>

</body>

<footer>

</footer>
<script src="app/js/jquery.min.js"></script>
<script src="app/libs/angular/angular.min.js"></script>
<script src="app/js/bootstrap.min.js"></script>
<script src="app/js/ui-bootstrap-tpls-2.0.0.js"></script>
<script src="app/controller/userController.js"></script>
<script src="app/js/services/userServices.js"></script>
<script src="app/js/services/facultyServices.js"></script>

</html>