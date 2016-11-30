var app = angular.module('mainApp')
    .constant('API_URL', 'http://localhost/VirtualHealth/public/api/');


app.factory('doctorServices',function($http,API_URL){
    return {
        get : function(){
            return $http.get(API_URL + "doctor");
        },

        getAllDoc: function(){
            return $http.get(API_URL + "getalldoc");
        },

        findByUser : function(id){
            return $http({
                method: 'GET',
                url: API_URL + "docbyuser/" + id
            });
        },


        findByRequest : function(){
            return $http({
                method: 'GET',
                url: API_URL + "docbyrequest"
            })
        },
        
        rateDoctor: function(id,data){
            return $http({
                method: 'POST',
                url: API_URL + "ratedoctor/" + id, 
                data:  $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },
        
        getHighDoctor: function(){
            return $http({
                method: 'GET',
                url: API_URL + "highdoctor"
            })
        },
        
        getFeedback: function(id){
            return $http({
                method: 'GET',
                url: API_URL + "getfeedback/" + id
            })
        },


        checkRequest : function(){
            return $http({
                method: 'GET',
                url: API_URL + "checkrequest"
            })
        },


        approveRequest : function(id){
            return $http({
                method: 'PUT',
                url: API_URL + "approverequest/" + id
            })
        },

        
        rejectRequest : function(id){
            return $http({
                method: 'PUT',
                url: API_URL + "rejectrequest/" + id
            })
        },
        

        save : function(docData){
            return $http({
                method: 'POST',
                url: API_URL + "doctor",
                data:  $.param(docData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },


        destroy : function(id){
            return $http({
                method: 'DELETE',
                url: API_URL + "doctor/" + id
            });
        },

        
        update : function(id,docData){
          return  $http({
                method: 'POST',
                url: API_URL + "doctor/" + id,
                data:  $.param(docData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }
})

