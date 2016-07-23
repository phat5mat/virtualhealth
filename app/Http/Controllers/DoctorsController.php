<?php

namespace App\Http\Controllers;
use App\Doctor;
use Response;
use Illuminate\Http\Request;
use App\Http\Requests;

class DoctorsController extends Controller
{
    public function index($id = null){
        if ($id == null) {
            $doctors = Doctor::all();
            return $doctors;
        } else {
            return $this->show($id);
        }
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
        return 'Doctor record successfully created with id ';
    }

    public function update(Request $request, $id) {
        $doctor = Doctor::find($id);
        $doctor->docid = $request->input('name');
        $doctor->docname = $request->input('email');
        $doctor->docpassword = $request->input('pass');
        $doctor->docemail = $request->input('email');
        $doctor->docphone = $request->input('phone');
        $doctor->docbiography = $request->input('biography');
        $doctor->docage = $request->input('age');
        $doctor->save();

        return "Sucess updating user #" . $doctor->id;
    }

    public function destroy($id) {
        $doctor = Doctor::find($id);
        $doctor->delete();
        return "Doctor record successfully deleted ";
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

