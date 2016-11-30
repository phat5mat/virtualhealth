<?php

namespace App\Http\Controllers;

use App\Doctor;
use App\Feedback;
use App\User;
use PhpParser\Comment\Doc;
use Response;
use Illuminate\Http\Request;
use App\Http\Requests;

class DoctorsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['findRequest','getHighRateDoctor']]);
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
        $newRate = 0;

        if(isset($newFeedback['comment'])){
            $feedback->comment = $newFeedback['comment'];
        }else{
            $feedback->comment = null;
        }
        if(isset($newFeedback['rate']))
        {
            $feedback->rate = $newFeedback['rate'];
        }else{
            $feedback->rate = 0;
        }
        $feedback->doctor = $id;
        $feedback->save();

        $totalFeedback = Feedback::where('doctor',$id)
            ->where('rate','<>',0)
            ->get();
        if(count($totalFeedback) == 0)
        {
            if(isset($newFeedback['rate']))
            {
                $doc->rating = $newFeedback['rate'];
                $doc->save();
            }
        }else{
            foreach($totalFeedback as $value)
            {
                $newRate = $newRate + $value->rate;
            }
            $newRate = $newRate / count($totalFeedback);
            $doc->rating = round($newRate);
            $doc->save();
        }

        return $totalFeedback;

    }

    public function getHighRateDoctor(){
        $doctor = Doctor::whereNotNull('rating')
            ->orderBy('rating','DESC')
            ->with('user')
            ->with('feedback')
            ->with('professional.speciality')
            ->take(5)
            ->get();
        return $doctor;
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

    public function getFeedback($id){
        $feedback = Feedback::where('doctor',$id)->whereNotNull('comment')->get();
        return $feedback;
    }

    public function findRequest()
    {
        $requestDoc = User::where('role', 1)->with('doctor')
            ->with('doctor.professional.speciality')
            ->get();
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
    


}

