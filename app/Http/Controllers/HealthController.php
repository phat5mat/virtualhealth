<?php

namespace App\Http\Controllers;

use App\Health;

use App\Http\Requests;

class HealthController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['store']]);
    }

    public function show()
    {
        return Health::all();
    }

    public function findHealthByPatient($id){
        $health = Health::where('patient',$id)
            ->get();
        return $health;
    }

    public function store(Request $request) {
        $newRoom = $request->all();
        $room = new Room;

        $room->startDate = $newRoom['startDate'];
        $room->roomSize = $newRoom['roomSize'];
        $room->available = $newRoom['roomSize'];
        $room->name =  $newRoom['name'];
        $room->doctor = $newRoom['doctor'];
        $room->save();


        return Response::json(array('success' => true));
    }
}
