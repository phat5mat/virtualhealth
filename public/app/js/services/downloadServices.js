/**
 * Created by REN on 9/29/2016.
 */
var app = angular.module('mainApp');

app.factory('downloadServices',function($http,API_URL,$q) {
    return {
        downloadZip: function(filename){
            return $http({
                method: 'GET',
                url: API_URL + "downloadZip/" + filename,
                responseType: 'arraybuffer'
            });        
        }
    }

});
