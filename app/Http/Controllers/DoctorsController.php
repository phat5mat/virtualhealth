<?php

namespace App\Http\Controllers;

use App\Doctor;
use App\Feedback;
use App\User;
use Response;
use Illuminate\Http\Request;
use App\Http\Requests;

class DoctorsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['findRequest']]);
    }


    public function index()
    {
        $doctors = User::where('role', 1)->with('doctor')->get();
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
        } else {
            return $doctor;
        }
    }

    public function getAllDoctor(){
        $doctor = Doctor::all();
        return $doctor;
    }

    public function rateDoctor($id,Request $request){
        $doc = Doctor::where('id',$id)->first();
        $newFeedback = $request->all();
        $feedback = new Feedback;
        $feedback->comment = $newFeedback->comment;
        if(isset($newFeedback->rate))
        {
            $feedback->rate = $newFeedback->rate;
        }else{
            $feedback->rate = 0;
        }
        $feedback->doctor = $id;
        $feedback->save();
        $newRate = 0;
        $totalFeedback = Feedback::where('doctor',$id)
            ->where('rate','!=',0)
            ->get();
        foreach($totalFeedback as $value)
        {
            $newRate = $newRate + $value->rate;
        }
        $newRate = $newRate / count($totalFeedback);
        $doc->rate = round($newRate);
        $doc->save();
        return $newRate;

    }

    public function findDocByUser($id)
    {
        $doctor = User::where('id', $id)
            ->with('doctor')
            ->with('doctor.professional')
            ->with('doctor.professional.speciality')
            ->with('doctor.room')
            ->with('doctor.room.appointment')
            ->first();
        if (!$doctor) {
            return Response::json([
                'error' => [
                    'message' => 'Doctor does not exist'
                ]
            ], 404);
        } else {
            return $doctor;
        }
    }


    public function findRequest()
    {
        $requestDoc = User::where('role', 1)->with('doctor')->get();
        return $requestDoc;
    }


    public function checkRequest()
    {
        $requestDoc = Doctor::where('status', 0)
            ->with('user')
            ->with('professional.speciality')
            ->get();
            return $requestDoc;
    }


    public function approveRequest($id)
    {
        $doctor = Doctor::where('id',$id)->first();
        $doctor->status = 1;
        $doctor->save();
        return 'Approve Successful';
    }


    public function rejectRequest($id)
    {
        $doctor = Doctor::where('id',$id)->first();
        $doctor->status = 2;
        $doctor->save();
        return "Sucess updating doctor ";
    }

    public function downloadZip($filename){
        $file= public_path(). "/app/zip/".$filename;
        $headers = array(
            'Content-type: application/octet-stream',
            'Content-type: application/zip'
        );

        return response()->download($file, $filename, $headers);

    }


    public function store(Request $request)
    {
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


    public function update(Request $request, $id)
    {
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


    public function destroy($id)
    {
        $doctor = Doctor::find($id);
        $doctor->delete();
        return Response::json(array('success' => true));
    }


}

