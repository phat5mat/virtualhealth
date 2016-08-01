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

Route::get('/signup', function () {
    return view('Signup');
});

Route::get('/login', function () {
    return view('Login');
});

Route::group(array('prefix' => 'api'), function() {

    Route::get('authenticate', 'AuthenticateController@index');
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/doctor', 'AuthenticateController@getAuthenticatedUser');
    
    Route::get('fac', 'FacultyController@show');
    Route::resource('doctor', 'DoctorsController');
    Route::resource('user', 'UsersController');
    Route::get('manageDoc',function(){
        return view('manageDoctors');
    });
});





