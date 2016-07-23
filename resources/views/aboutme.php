<!doctype html>
<html ng-app="ui.bootstrap.demo">
<head>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.js"></script>
    <script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.0.0.js"></script>

    <link href="//netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div ng-controller="ButtonsCtrl">
    <h4>Single toggle</h4>
    <pre>{{singleModel}}</pre>
    <button type="button" class="btn btn-primary" ng-model="singleModel" uib-btn-checkbox btn-checkbox-true="1" btn-checkbox-false="0">
        Single Toggle
    </button>
    <h4>Checkbox</h4>
    <pre>Model: {{checkModel}}</pre>
    <pre>Results: {{checkResults}}</pre>
    <div class="btn-group">
        <label class="btn btn-primary" ng-model="checkModel.left" uib-btn-checkbox>Left</label>
        <label class="btn btn-primary" ng-model="checkModel.middle" uib-btn-checkbox>Middle</label>
        <label class="btn btn-primary" ng-model="checkModel.right" uib-btn-checkbox>Right</label>
    </div>
    <h4>Radio &amp; Uncheckable Radio</h4>
    <pre>{{radioModel || 'null'}}</pre>
    <div class="btn-group">
        <label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'Left'">Left</label>
        <label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'Middle'">Middle</label>
        <label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'Right'">Right</label>
    </div>
    <div class="btn-group">
        <label class="btn btn-success" ng-model="radioModel" uib-btn-radio="'Left'" uncheckable>Left</label>
        <label class="btn btn-success" ng-model="radioModel" uib-btn-radio="'Middle'" uncheckable>Middle</label>
        <label class="btn btn-success" ng-model="radioModel" uib-btn-radio="'Right'" uib-uncheckable="uncheckable">Right</label>
    </div>
    <div>
        <button class="btn btn-default" ng-click="uncheckable = !uncheckable">
            Toggle uncheckable
        </button>
    </div>
</div>
</body>

</html>