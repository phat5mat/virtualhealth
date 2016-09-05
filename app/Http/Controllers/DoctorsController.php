<?php

namespace App\Http\Controllers;
use App\Doctor;
use App\User;
use PhpParser\Comment\Doc;
use Response;
use Illuminate\Http\Request;
use App\Http\Requests;

class DoctorsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth');  
    }

    
    public function index(){
        $doctors = User::where('role',1)->with('doctor')->get();
        return $doctors;
    }

    
    public function show($id)
    {
        $doctor = Doctor::find($id);

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

    
    public function findDocByUser($id){
        $user = User::find($id);
        $doctor = $user->doctor;
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

    
    public function findUnactiveDoc(){
        $requestDoc = Doctor::where('status',0)->with('user')->get();
        return $requestDoc;
    }

    
    public function checkRequest(){
        $requestDoc = Doctor::where('status',0)->get();
        if(!$requestDoc)
            return 0;
        else
            return $requestDoc->count();
    }

    
    public function approveRequest($id){
        $doctor = Doctor::find($id);
        $doctor->status = 1;
        $doctor->save();
        return "Sucess updating doctor ";
    }

    
    public function rejectRequest($id){
        $doctor = Doctor::find($id);
        $doctor->status = 2;
        $doctor->save();
        return "Sucess updating doctor ";
    }
    
    
    public function store(Request $request) {
        $newDoc = $request->all();
        $doc = new Doctor;
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
        $doctor = Doctor::find($id);
        $doctor->docid = $updateDoc['docid'];
        $doctor->docname = $updateDoc['docname'];
        $doctor->docpassword = $updateDoc['docpassword'];
        $doctor->docemail = $updateDoc['docemail'];
        $doctor->docphone = $updateDoc['docphone'];
        $doctor->save();

        return "Sucess updating doctor ";
    }

    
    public function destroy($id) {
        $doctor = Doctor::find($id);
        $doctor->delete();
        return Response::json(array('success' => true));
    }
    

}

