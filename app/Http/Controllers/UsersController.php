<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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

        $user->name = $updateUser['name'];
        $user->password = $updateUser['password'];
        $user->email = $updateUser['email'];
        $user->phone = $updateUser['phone'];
        $user->save();

        return "Sucess updating user ";
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
