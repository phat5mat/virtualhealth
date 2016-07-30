<!DOCTYPE html>
<html lang="en-US" ng-app="doctorMain" ng-controller="doctorController">
<head>
    <title>Doctor Management</title>

    <link rel="stylesheet" href="<?= asset('app/css/bootstrap.min.css') ?>">
    <link rel="stylesheet" href="<?= asset('app/css/font-awesome/css/font-awesome.min.css') ?>">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div ng-include="'template/navbar.html'" ></div>
</head>
<body>
<h2>Doctors Database</h2>
<div>
    <!-- Table-to-load-the-data Part -->
    <table class="table" >
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
        <p class="text-center" ng-show="loading"><span class="fa fa-meh-o fa-5x fa-spin"></span></p>
        <tr ng-repeat="doctor in doctors" ng-hide="loading">
            <td>{{ doctor.docid }}</td>
            <td>{{ doctor.docname }}</td>
            <td>{{ doctor.docemail }}</td>
            <td>{{ doctor.docphone }}</td>

            <td>
                <button class="btn btn-default btn-detail" ng-click="fillUpdate(doctor)">Edit</button>
                <button class="btn btn-danger btn-delete" ng-click="removeDoc(doctor.docid)">Delete</button>
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

    <form ng-submit="updateDoc()" name="doctorForm">

        Username: <input type="text" name="docid" ng-model="doctor.docid" required><br/>
        Password: <input type="password" name="docpassword" ng-model="doctor.docpassword" required><br/>
        Name: <input type="text" ng-model="doctor.docname" name="docname" required><br/>
        Email: <input type="email" ng-model="doctor.docemail" name="docemail" required><br/>
        Phone: <input type="tel" ng-model="doctor.docphone" name="docphone" required><br/>
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        <button type="submit" class="btn btn-warning" ng-disabled="doctorForm.$invalid">Update</button>
    </form>

</div>





</body>

<footer>

</footer>
<script src="<?= asset('app/js/jquery.min.js') ?>"></script>
<script src="<?= asset('app/libs/angular/angular.min.js') ?>"></script>
<script src="<?= asset('app/js/bootstrap.min.js') ?>"></script>
<script src="<?= asset('app/js/ui-bootstrap-tpls-2.0.0.js') ?>"></script>
<script src="<?= asset('app/controller/doctorController.js') ?>"></script>
<script src="<?= asset('app/js/services/doctorServices.js') ?>"></script>
<script src="<?= asset('app/js/app.js') ?>"></script>
</html>