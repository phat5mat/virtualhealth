<?php

namespace App\Http\Controllers;

use App\Room;
use Illuminate\Http\Request;
use App\Patient;
use App\User;
use App\Appointment;

use App\Http\Requests;

class PatientsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth',['except' => ['store']]);
    }
    
    
    public function index(){
        $userList = User::all();


        return $userList;
    }

    
    public function show($id)
    {

        $patient = Patient::find($id);

        if (!$patient) {
            return Response::json([
                'error' => [
                    'message' => 'Doctor does not exist'
                ]
            ], 404);
        }else{
            return $patient;
        }
    }

    
    public function findByUser($id){
        $user = User::find($id);
        $patient = $user->patient;
        if (!$patient) {
            return Response::json([
                'error' => [
                    'message' => 'Patient does not exist'
                ]
            ], 404);
        }else{
            return $patient;
        }
    }
    
   public function findByDoctor($id){
       $pat = Room::where('doctor',$id)
           ->with('appointment.patient.user')
           ->with('appointment.room.speciality')
           ->get();
       return $pat;
   }


    public function findByUserWithUser($id){
        $user = User::where('id',$id)->with('patient')->get();
        if (!$user) {
            return Response::json([
                'error' => [
                    'message' => 'Patient does not exist'
                ]
            ], 404);
        }else{
            return $user;
        }
    }
    
    public function findByRoom($id){
        $patient = Appointment::where('room',$id)->with('patient')->with('patient.user')->get();
        if (!$patient) {
            return Response::json([
                'error' => [
                    'message' => 'Patient does not exist'
                ]
            ], 404);
        }else{
            return $patient;
        }
    }


    public function findByUsername($id){
        $patient = User::where('room',$id)->with('patient')->with('patient.user')->get();
        if (!$patient) {
            return Response::json([
                'error' => [
                    'message' => 'Doctor does not exist'
                ]
            ], 404);
        }else{
            return $patient;
        }
    }

    public function store(Request $request) {
        $newDoc = $request->all();
        $doc = new Patient;
        $doc->docpassword = $newDoc['docpassword'];
        $doc->docname = $newDoc['docname'];
        $doc->docemail = $newDoc['docemail'];
        $doc->docphone = $newDoc['docphone'];
        $doc->docid = $newDoc['docid'];

        $doc->save();
        return Response::json(array('success' => true));
    }

    
    public function update(Request $request, $id) {
        $updateDoc = $request->all();
        $doctor = Patient::find($id);
        $doctor->docid = $updateDoc['docid'];
        $doctor->docname = $updateDoc['docname'];
        $doctor->docemail = $updateDoc['docemail'];
        $doctor->docphone = $updateDoc['docphone'];
        $doctor->save();

        return "Sucess updating doctor ";
    }

    
    public function destroy($id) {
        $patient = Patient::where('users',$id)->get();  
        $patient->delete();
        return Response::json(array('success' => true));
    }



}
