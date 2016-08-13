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



Route::group(array('prefix' => 'api'), function() {

    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
    
    Route::get('fac', 'FacultyController@show');
    Route::resource('doctor', 'DoctorsController');
    Route::resource('user', 'UsersController');
    Route::resource('patient', 'PatientsController');
    Route::resource('room', 'RoomController');
    Route::resource('appointment', 'AppointmentsController');

    Route::get('docbyuser/{user}','DoctorsController@findByUser');
    Route::get('patbyuser/{user}','PatientsController@findByUser');
    Route::get('findbydoctor/{doctor}','RoomController@findByDoctor');
    Route::get('patAppointmentList/{patients}','AppointmentsController@patAppointmentList');


    Route::get('manageDoc',function(){
        return view('manageDoctors');
    });
});





