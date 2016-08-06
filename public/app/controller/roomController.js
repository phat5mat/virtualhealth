/**
 * Created by REN on 8/5/2016.
 */
var app = angular.module('authMain');
app.controller('roomController',['$scope','$mdDialog',
    function ($scope,$mdDialog) {
        $scope.showPrompt = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()

                .title('What would you name your dog?')
                .textContent('Bowser is a common name.')
                .placeholder('Dog name')
                .ariaLabel('Dog name')
                .initialValue('Buddy')
                .ok('Okay!')
                .cancel('I\'m a cat person');
            $mdDialog.show(confirm).then(function(result) {
               console.log('haha');
            }, function() {
                console.log('haha');
            });
        }}]);

