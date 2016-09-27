<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/test', function () {
    return view('test');
});



Route::group(array('prefix' => 'api'), function() {

    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
    
    Route::get('fac', 'FacultyController@show');
    Route::resource('doctor', 'DoctorsController');
    Route::resource('user', 'UsersController');
    Route::get('finduserbyid/{id}', 'UsersController@findUserByID');
    Route::post('validatepass','UsersController@validatePassword');
    Route::post('changepass','UsersController@changePassword');

    
    Route::resource('patient', 'PatientsController');
    Route::resource('room', 'RoomController');
    Route::resource('appointment', 'AppointmentsController');
    Route::resource('examination', 'ExaminationController');
    
    Route::get('docbyuser/{user}','DoctorsController@findDocByUser');
    Route::get('docbyrequest','DoctorsController@findUnactiveDoc');
    Route::get('checkrequest','DoctorsController@checkRequest');
    Route::put('approverequest/{doctor}','DoctorsController@approveRequest');
    Route::put('rejectrequest/{doctor}','DoctorsController@rejectRequest');


    Route::get('patbyuser/{user}','PatientsController@findByUser');
    Route::get('patbyuserwith/{user}','PatientsController@findByUserWithUser');
    Route::get('patbyroom/{room}','PatientsController@findByRoom');


    Route::get('findroombydoctor/{doctor}','RoomController@findByDoctor');

    Route::get('exambypatient/{pat}','ExaminationController@findByPatient');
    Route::get('exambyappoint/{pat}','ExaminationController@findByAppointment');


    Route::get('finduserbydoc/{doctor}','UsersController@findUserByDoc');
    Route::get('patAppointmentList/{patients}','AppointmentsController@patAppointmentList');
    Route::post('getslotnumber','AppointmentsController@getSlotNumber');

    Route::get('manageDoc',function(){
        return view('manageDoctors');
    });
});





