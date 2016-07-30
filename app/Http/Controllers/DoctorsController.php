<?php

namespace App\Http\Controllers;
use App\Doctor;
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
        return Response::json(Doctor::get());
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

    
    public function transformCollection($doctors){
        return array_map([$this,'transform'], $doctors->toArray());

    }

    public function transform($doctor){
        return [
            'ID' => $doctor['docid'],
            'Name' => $doctor['docname']
        ];
    }



}

