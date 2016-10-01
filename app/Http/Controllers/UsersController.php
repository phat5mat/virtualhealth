<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use App\User;
use App\Patient;
use App\Doctor;
use App\Http\Requests;
use Response;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['store']]);
    }
    
    
    public function index()
    {
       $userList = User::all(); 
        return $userList;
    }

    public function findUserByID($id){
        $user = User::where('id',$id)->first();
        return $user;
    }

    public function findUserByDoc($id){
        $doctor = Doctor::where('id',$id)->with('user')->get();
        if (!$doctor) {
            return Response::json([
                'error' => [
                    'message' => 'Doctor does not exist'
                ]
            ], 404);
        }else{
            return $doctor;
        }
    }


    public function store(Request $request) {
        $newUser = $request->all();
        $user = new User;

        $user->username = $newUser['username'];
        $user->password = bcrypt($newUser['password']);
        $user->name = $newUser['name'];
        $user->email = $newUser['email'];
        $user->phone = $newUser['phone'];
        $user->dateofbirth = $newUser['dateofbirth'];
        $user->role = $newUser['role'];
        $user->save();

        if($newUser['role'] == 1)
        {
            $doc = new Doctor;
            $doc->professional = $newUser['pro'];
            $doc->certification = $newUser['cert'];
            $doc->users = $user->id;
            $doc->status = 0;
            $doc->faculty = $newUser['faculty']['id'];
            $doc->save();
        }
        if($newUser['role'] == 0)
        {
            $pat = new Patient;
            $pat->users = $user->id;
            $pat->save();
        }

        return Response::json(array('success' => true));
    }

    
    public function update(Request $request, $id) {

        $updateUser = $request->all();
        $user = User::find($id);

        $user->name = $updateUser['updateName'];
        $user->email = $updateUser['email'];
        $user->phone = $updateUser['phone'];
        $user->dateofbirth = $updateUser['dateofbirth'];
        $user->save();

        return "Success updating user ";
    }

    public function validatePassword(Request $request){
        $pass = $request->all();
        $user = User::where('id',$pass['user'])->first();
        if(Auth::validate(['username'=>$user->username,'password'=>$pass['pass']]))
            return "true";
        else
            return "false";

    }
    
    public function changePassword(Request $request){
        $pass = $request->all();
        $user = User::where('id',$pass['user'])->first();
        $user->password = bcrypt($pass['pass']);
        $user->save();
        return "Success changing password";

    }
    
    public function saveAvatar(Request $request){
        // checking file is valid.
        if (Input::file('file')) {
            $user = Auth::User();
            $destinationPath = 'assets/img'; 
            $fileName = "avatar-".$user->username.".jpg";
            Input::file('file')->move($destinationPath, $fileName); 
            $user->avatar = 1;
            $user->save();
            return 'Upload Avatar Successful';
        }
        else {
            // sending back with error message.
            return $request->all();
        }
    }

    public function destroy(Request $request,$id) {
        $role = $request->all();
        if($role = 0){
            $patient = User::find($id)->patient;
            $patient->delete();
        }
        if($role = 1){
            $doctor = User::find($id)->doctor;
            $doctor->delete();
        }

        $user = User::find($id);
        $user->delete();
        return Response::json(array('success delete user ' + $id => true));
    }


}
