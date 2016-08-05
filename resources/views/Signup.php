<!DOCTYPE html>
<html ng-app="userApp" ng-controller="userController">
<head>
    <title>Signup</title>
    <link rel="stylesheet" href="app/css/bootstrap.min.css">
    <link rel="stylesheet" href="app/css/font-awesome/css/font-awesome.min.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'app/template/navbar.html'" ></div>

</head>
<body style="background-color:powderblue;">
<div class="container" ng-show="selectRole" ng-init="selectRole = true">
    <div class="row">
        <div class="col-md-12 text-center"><h3><strong>Register as</strong></h3></div>
    </div>
    <div class="row">
        <div class="col-md-6 text-center">
            <button ng-click="showPatForm(); user.role = 0">Patient</button>
        </div>
        <div class="col-md-6 text-center">
            <button ng-click="showDocForm(); user.role = 1">Doctor</button>
        </div>

    </div>

</div>

    <form ng-show="patForm" ng-init="patForm = false"  ng-submit="register()" name="patientForm">
        <div class="container">
            <div class="jumbotron" style="margin-top: 120px">

                <div class="page-header">
                    <h3 style="text-align: center">Patient Signup Form</h3>
                </div>
                <table class="table ">
                    <tbody>
                    <tr>
                        <td class="col-md-2"><strong>Username: </strong></td>
                        <td class="col-md-10"><input ng-model="user.username" name="username" required></td>
                    </tr>
                    <tr>
                        <td class="col-md-2"><strong>Password: </strong></td>
                        <td class="col-md-10"><input type="password" ng-model="user.password" name="password" required></td>
                    </tr>
                    <tr>
                        <td class="col-md-2"><strong>Name: </strong></td>
                        <td class="col-md-10"><input ng-model="user.name" name="name" required></td>
                    </tr>
                    <tr>
                        <td class="col-md-2"><strong>Phone number: </strong></td>
                        <td class="col-md-10"><input ng-model="user.phone" name="phone" required></td>
                    </tr>
                    <tr>
                        <td class="col-md-2"><strong>Email: </strong></td>
                        <td class="col-md-10"><input type="email" ng-model="user.email" name="email" required></td>
                    </tr>
                    <tr>
                        <td class="col-md-2"><strong>Date of Birth: </strong></td>
                        <td class="col-md-10"><input type="date"
                                                     ng-model="user.dateinput"
                                                     min="1920-01-01" max="1995-01-01"
                                                     name="dateofbirth" required></td>
                    </tr>

                    </tbody>
                </table>
                <div class="col-md-1">
                    <button class="btn btn-warning" ng-click="backForm()">Back</button>
                </div>

                    <div class="col-md-6">
                        <button name="submit" ng-disabled="patientForm.$invalid"
                                type="submit" class="btn btn-primary btn-lg pull-right">Register</button>
                    </div>

            </div>
        </div>
    </form>

<form ng-show="docForm" ng-init="docForm = false" ng-submit="register()" name="doctorForm">
    <div class="container">
        <div class="jumbotron" style="margin-top: 120px">

            <div class="page-header">
                <h3 style="text-align: center">Doctor Signup Form</h3>
            </div>
            <table class="table ">
                <tbody>
                <tr>
                    <td class="col-md-2"><strong>Username: </strong></td>
                    <td class="col-md-10"><input ng-model="user.username" name="username" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Password: </strong></td>
                    <td class="col-md-10"><input type="password" ng-model="user.password" name="password" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Name: </strong></td>
                    <td class="col-md-10"><input ng-model="user.name" name="name" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Phone number: </strong></td>
                    <td class="col-md-10"><input ng-model="user.phone" name="phone" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Email: </strong></td>
                    <td class="col-md-10"><input type="email" ng-model="user.email" name="email" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Date of Birth: </strong></td>
                    <td class="col-md-10"><input type="date"
                                                 ng-model="user.dateinput"
                                                 min="1920-01-01" max="1995-01-01"
                                                 name="dateofbirth" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Faculty: </strong></td>
                    <td class="col-md-10"><select ng-model="user.faculty" ng-options="f.name for f in facList" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Professional: </strong></td>
                    <td class="col-md-10"><input ng-model="user.pro" name="email" required></td>
                </tr>
                <tr>
                    <td class="col-md-2"><strong>Certification: </strong></td>
                    <td class="col-md-10"><input ng-model="user.cert" name="email" required></td>
                </tr>
                </tbody>
            </table>
            <div class="col-md-1">
                <button class="btn btn-warning" ng-click="backForm()">Back</button>
            </div>

            <div class="col-md-6">
                <button name="submit" ng-disabled="doctorForm.$invalid"
                        type="submit" class="btn btn-primary btn-lg pull-right">Register</button>
            </div>

        </div>
    </div>
</form>

<div class="container" ng-show="successPage">
    <div class="jumbotron" style="margin-top: 120px">
        <div class="page-header bg-success text-center">
            <h2>
                <b>Registration Successful</b>
            </h2>
        </div>
        <div class="row">
            Welcome {{ user.name }}!
        </div>
        <div class="row">
            <h3>Thank you for registering, now you can login into Virtual Healthcare </h3>
        </div>
        <div class="row">
            <button class="btn btn-primary" ng-click="goLogin()">Login</button>
        </div>
    </div>
</div>


</body>

<script src="app/js/jquery.min.js"></script>
<script src="app/libs/angular/angular.min.js"></script>
<script src="app/js/bootstrap.min.js"></script>
<script src="app/js/ui-bootstrap-tpls-2.0.0.js"></script>
<script src="app/controller/userController.js"></script>
<script src="app/js/services/userServices.js"></script>
<script src="app/js/services/facultyServices.js"></script>

</html>