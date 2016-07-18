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
    return view('welcome');
});

Route::get('/aboutme', 'PagesController@aboutme');
Route::get('/doctor/create','PagesController@createView');
Route::post('/createSuccess  ','PagesController@createAction');
Route::group(['prefix' => 'vh'],function(){
    Route::resource('/doctor','DoctorsController');
});

Route::get('/test', function(){
    return view('test');
});

