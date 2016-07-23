<!DOCTYPE html>
<html lang="en">
<head>

    <title>Form trong Laravel 5</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

   <script>


       angular.module("myapp", []).controller("TestController", function($scope) {
           $scope.user = {
               name : 'Siren',
               job : 'Gakusei'
           };
       });

   </script>
</head>
<body>
<div ng-app="myapp">
    <h1 class=""></h1>
    <div ng-controller="TestController">
        <h2>Hajimemashite @{{ user.name }} watashi ha @{{ user.job  }}   </h2>
    </div>
    <div ng-controller="ContentController">
        <h2>Hajimemashite @{{ user.name }} watashi ha @{{ user.job  }}   </h2>
    </div>

</div>
</body>
</html>