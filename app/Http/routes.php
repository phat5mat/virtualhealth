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
    
    Route::get('special', 'SpecialityController@show');
    Route::resource('doctor', 'DoctorsController');
    Route::resource('user', 'UsersController');
    Route::get('finduserbyid/{id}', 'UsersController@findUserByID');
    Route::get('checkusername/{user}', 'UsersController@checkUsername');
    Route::get('checkemail/{user}', 'UsersController@checkEmail');

    Route::post('validatepass','UsersController@validatePassword');
    Route::post('changepass','UsersController@changePassword');
    Route::post('saveavatar','UsersController@saveAvatar');
    Route::post('savezip/{doc}','UsersController@saveZip');


    Route::resource('patient', 'PatientsController');
    Route::get('patbydoctor/{doctor}', 'PatientsController@findByDoctor');


    Route::resource('room', 'RoomController');
    Route::resource('appointment', 'AppointmentsController');
    Route::get('doctorappoint/{doctor}', 'AppointmentsController@findByDoctor');
    Route::get('doctorappoint2/{doctor}', 'AppointmentsController@findByDoctor2');
    Route::post('checkAppointExist', 'AppointmentsController@checkAppointmentExist');
    Route::get('patbyid/{pat}', 'AppointmentsController@findByID');
    Route::get('examappoint/{exam}', 'AppointmentsController@findByExamination');

    
    Route::resource('examination', 'ExaminationController');
    Route::get('specialbydoctor/{doctor}', 'SpecialityController@findSpeciaByDoctor');

    Route::put('updateRoomStatus/{room}','RoomController@updateRoomStatus');
    
    Route::get('docbyuser/{user}','DoctorsController@findDocByUser');
    Route::get('docbyrequest','DoctorsController@findRequest');
    Route::get('checkrequest','DoctorsController@checkRequest');
    Route::put('approverequest/{doctor}','DoctorsController@approveRequest');
    Route::put('rejectrequest/{doctor}','DoctorsController@rejectRequest');
    Route::get('downloadZip/{doctor}','DoctorsController@downloadZip');
    Route::get('getalldoc','DoctorsController@getAllDoctor');
    Route::post('ratedoctor/{doctor}','DoctorsController@rateDoctor');
    Route::get('highdoctor','DoctorsController@getHighRateDoctor');
    Route::get('getfeedback/{doctor}','DoctorsController@getFeedback');

    Route::get('patbyuser/{user}','PatientsController@findByUser');
    Route::get('patbyuserwith/{user}','PatientsController@findByUserWithUser');
    Route::get('patbyroom/{room}','PatientsController@findByRoom');
    
    Route::get('findroombydoctor/{doctor}','RoomController@findByDoctor');

    Route::get('exambypatient/{pat}','ExaminationController@findByPatient');
    Route::get('exambyappoint/{pat}','ExaminationController@findByAppointment');
    Route::get('exambydoctor/{doc}','ExaminationController@findByDoctor');
    Route::get('exambyspec/{doc}','ExaminationController@findBySpeciality');
    Route::get('lastexambypatient/{pat}','ExaminationController@findLastExaminationByPatient');



    Route::get('finduserbydoc/{doctor}','UsersController@findUserByDoc');
    Route::get('patAppointmentList/{patients}','AppointmentsController@patAppointmentList');
    Route::post('getslotnumber','AppointmentsController@getSlotNumber');
    Route::put('updateAppointStatus/{room}','AppointmentsController@updateAppointmentStatus');
    Route::put('updateAppointStatusIndividual/{apapoint}','AppointmentsController@updateAppointStatusIndividual');
    Route::put('updateAppointmentStatusExpired/{apapoint}','AppointmentsController@updateAppointmentStatusExpired');
    
    Route::get('manageDoc',function(){
        return view('manageDoctors');
    });
});





