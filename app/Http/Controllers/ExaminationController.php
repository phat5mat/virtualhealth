<?php

namespace App\Http\Controllers;
use Faker\Provider\DateTime;
use Illuminate\Http\Request;
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


    public function store(Request $request) {
        $newExam = $request->all();
        $exam = new Examination;

        $exam->logs = $newExam['chatLog'];
        $exam->result = $newExam['result'];

        $exam->save();


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
