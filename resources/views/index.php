<!DOCTYPE html>
<html lang="en-US" ng-app="doctorRecords">
<head>
    <title>Laravel 5 AngularJS CRUD Example</title>

    <link rel="stylesheet" href="<?= asset('app/css/bootstrap.min.css') ?>">
    <meta name="csrf-token" content="{{ csrf_token() }}">

</head>
<body>
<h2>Employees Database</h2>
<div  ng-controller="DoctorsController">
    <!-- Table-to-load-the-data Part -->
    <table class="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact No</th>

            <th><button id="btn-add" class="btn btn-primary btn-xs" ng-click="toggle('add', 0)">Add New Doctor</button></th>
        </tr>
        </thead>
        <tbody>
        <tr ng-repeat="doctor in doctors">
            <td>{{ doctor.docid }}</td>
            <td>{{ doctor.docname }}</td>
            <td>{{ doctor.docemail }}</td>
            <td>{{ doctor.docphone }}</td>

            <td>
                <button class="btn btn-default btn-xs btn-detail">Edit</button>
                <button class="btn btn-danger btn-xs btn-delete" ng-click="removeDoc(doctor.docid)">Delete</button>
            </td>
        </tr>
        </tbody>
    </table>

    <form ng-submit="saveDoc()" name="doctorForm">

        Username: <input type="text" name="docid" ng-model="doctor.docid" required><br/>
        Password: <input type="password" name="docpassword" ng-model="doctor.docpassword" required><br/>
        Name: <input type="text" ng-model="doctor.docname" name="docname" required><br/>
        Email: <input type="email" ng-model="doctor.docemail" name="docemail" required><br/>
        Phone: <input type="tel" ng-model="doctor.docphone" name="docphone" required><br/>
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        <button type="submit" class="btn btn-primary" ng-disabled="doctorForm.$invalid">Save</button>
    </form>

</div>





</body>

<footer>

</footer>
<script src="<?= asset('app/js/jquery-3.1.0.js') ?>"></script>
<script src="<?= asset('app/libs/angular/angular.min.js') ?>"></script>
<script src="<?= asset('app/js/ui-bootstrap-tpls-2.0.0.js') ?>"></script>
<script src="<?= asset('app/controller/doctors.js') ?>"></script>
</html>