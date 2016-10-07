<?php

namespace App\Http\Controllers;
use App\Appointment;
use Illuminate\Http\Request;
use DB;
use App\Room;
use App\Examination;
use App\Prescription;
use App\Drug;


use App\Http\Requests;
use Response;


class ExaminationController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['store']]);
    }


    public function index()
    {
        $roomList = Room::all();
        return $roomList;
    }


    public function findByDoctor($id){
        $roomList = Room::where('doctor',$id)->with('doctor.user')->get();
        return $roomList;
    }

    public function findByPatient($id){
        $exam = Appointment::where('patients',$id)
            ->with('examination.prescription.drug')
            ->with('room.doctor.user')
            ->with('room.doctor.faculty')
            ->with('patient.user')
            ->get();
        return $exam;
    }

    public function findByAppointment($id){
        $exam = Appointment::where('id',$id)
            ->with('examination.prescription.drug')
            ->with('room.doctor.user')
            ->with('room.doctor.faculty')
            ->with('patient.user')
            ->get();
        return $exam;
    }

    public function store(Request $request) {
        $newExam = $request->all();
        $examID = DB::table('examination')->insertGetId(
            [
                'logs' => $newExam['chatLog'],
                'result' => $newExam['result']
            ]
        );
        $presID = DB::table('prescription')->insertGetId(
            [
                'examination' => $examID,
            ]
        );

        $appoint = Appointment::find($newExam['appointment']);
        $appoint->examination = $examID;
        $appoint->status = 2;
        $appoint->save();

        if(isset($newExam['prescription']))
        {
            foreach ($newExam['prescription'] as $value)
            {
                $drug = new Drug;
                $drug->name = $value['name'];
                $drug->quantity = $value['quantity'];
                $drug->prescription = $presID;
                $drug->save();

            }
        }
        
        return Response::json(array('success' => true));
    }


    public function update(Request $request, $id) {

        $updateRoom = $request->all();
        $room = Room::find($id);

        $room->name = $updateRoom['name'];
        $room->roomSize = $updateRoom['roomSize'];
        $room->available = $updateRoom['available'];
        $room->save();

        return "Sucess updating user ";
    }


    public function destroy($id) {
        $room = Room::find($id);
        $room->delete();
        return Response::json(array('success delete room ' + $id => true));
    }
    
    
    
}
