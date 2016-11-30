<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use App\User;
use App\Patient;
use App\Doctor;
use App\Professional;
use App\Http\Requests;
use DB;
use Response;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['store','checkUsername','checkEmail','saveZip']]);
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
            if(isset($newUser['exp']))
                $addExp = $newUser['exp'];
            else
                $addExp = 'No Experience';
            
            $docID = DB::table('doctors')->insertGetId(
                [
                    'experience' => $addExp,
                    'users' => $user->id,
                    'status' => 0,
                    'certification' => $newUser['certification']
                ]
            );
            foreach($newUser['speciality'] as $value)
            {
                $pro = new Professional;
                $pro->doctor = $docID;
                $pro->speciality = $value['id'];
                $pro->save();
            }
        }
        if($newUser['role'] == 0)
        {
            $pat = new Patient;
            $pat->users = $user->id;
            if(isset($newUser['insurance']))
                $pat->health_insurance = $newUser['insurance'];
            if(isset($newUser['credit']))
                $pat->credit_card = $newUser['credit'];
            $pat->save();
        }

        if($newUser['role'] == 0)
            return 'success';
        if($newUser['role'] == 1)
            return $docID;
    }

    public function checkUsername($username){
        $user = User::where('username',$username)->get();
        if(count($user) > 0)
            return 'false';
        else
            return 'true';
    }

    public function checkEmail($email){
        $user = User::where('email',$email)->get();
        if(count($user) > 0)
            return 'false';
        else
            return 'true';
    }

    
    public function update(Request $request, $id) {

        $updateUser = $request->all();
        $user = User::find($id);

        $user->name = $updateUser['updateName'];
        $user->email = $updateUser['email'];
        $user->phone = $updateUser['phone'];
        $user->dateofbirth = $updateUser['dateofbirth'];
        if($user->role == 0)
        {
            $pat = Patient::where('users',$id)->first();
            if(isset($updateUser['insurance']))
                $pat->health_insurance = $updateUser['insurance'];
            if(isset($updateUser['credit']))
                $pat->credit_card = $updateUser['credit'];
            $pat->save();
        }


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

    public function saveZip(Request $request,$id){
        // checking file is valid.
        if (Input::file('file')) {
            $doc = Doctor::where('id',$id)->first();
            $destinationPath = 'app/zip';
            $fileName = "doctorID-".$doc->id.".zip";
            Input::file('file')->move($destinationPath, $fileName);
            return 'Upload Zip Successful';
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
