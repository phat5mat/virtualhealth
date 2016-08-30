<?php

namespace App\Http\Controllers;
use Faker\Provider\DateTime;
use Illuminate\Http\Request;
use App\Room;


use App\Http\Requests;
use Response;


class RoomController extends Controller
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
        $roomList = Room::where('doctor',$id)->get();
        return $roomList;
    }
    
    
    public function store(Request $request) {
        $newRoom = $request->all();
        $room = new Room;

        $room->startDate = $newRoom['startDate'];
        $room->endDate = $newRoom['endDate'];
        $room->roomSize = $newRoom['roomSize'];
        $room->available = $newRoom['roomSize'];
        $room->name =  $newRoom['name'];
        $room->doctor = $newRoom['doctor'];
        $room->save();


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