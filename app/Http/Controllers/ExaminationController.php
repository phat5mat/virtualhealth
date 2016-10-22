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
use Illuminate\Support\Facades\App;
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
        $exam = Room::where('doctor',$id)
            ->with('speciality')
            ->with('appointment')
            ->with('appointment.examination')
            ->with('appointment.patient.user')
            ->with('speciality')
            ->with('appointment.examination.prescription.drug')
            ->get();
        return $exam;
    }

    public function findByPatient($id){
        $exam = Appointment::where('patients',$id)
            ->whereNotNull('examination')
            ->with('examination.prescription.drug')
            ->with('room.doctor.user')
            ->with('room.speciality')
            ->with('patient.user')
            ->get();
        return $exam;
    }
    

    public function findByAppointment($id){
        $exam = Appointment::where('id',$id)
            ->with('examination.prescription.drug')
            ->with('room.doctor.user')
            ->with('room.doctor.professional.speciality')
            ->with('patient.user')
            ->get();
        return $exam;
    }
    
    public function findLastExaminationByPatient($id){
        $exam = Appointment::where('patients',$id)
            ->whereNotNull('examination')
            ->with('examination.prescription.drug')
            ->with('room.speciality')
            ->with('patient.user')
            ->orderBy('id','desc')
            ->first();
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
