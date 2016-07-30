/**
 * Created by REN on 7/25/2016.
 */
var doctorApp = angular.module('doctorMain', ['doctorApp', 'doctorServices']);

var userApp = angular.module('userMain', ['userApp', 'userServices','facultyServices']);

var patientApp = angular.module('patientMain', ['patientApp', 'patientServices']);