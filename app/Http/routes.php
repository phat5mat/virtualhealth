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

Route::get('/api/v1/doctor/{id?}', 'DoctorsController@index');
Route::post('/api/v1/doctor', 'DoctorsController@store');
Route::post('/api/v1/doctor/{id}', 'DoctorsController@update');
Route::delete('/api/v1/doctor/{id}', 'DoctorsController@destroy');

Route::get('/aboutme', 'PagesController@aboutme');
Route::get('/doctor/create','PagesController@createView');
Route::post('/createSuccess  ','PagesController@createAction');


