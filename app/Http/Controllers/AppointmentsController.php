<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Appointment;
use App\User;

use App\Http\Requests;
use Illuminate\Support\Facades\App;

class AppointmentsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function index()
    {
        $roomList = Appointment::all();
        return $roomList;
    }


    public function findByDoctor($id)
    {
        $roomList = Appointment::where('doctor', $id)->get();
        return $roomList;
    }


    public function patAppointmentList($id)
    {
        $roomList = Appointment::where('patients', $id)
            ->with('room.doctor.user')
            ->get();
        return $roomList;
    }

    public function getSlotNumber(Request $request)
    {
        $data = $request->all();
        $patient = User::find($data['user']);
        $patient = $patient->patient;
        $findQuery = ['patients' => $patient['id'], 'room' => $data['room']];
        $slot = Appointment::where($findQuery)->get();
        return $slot;
    }

    public function updateAppointmentStatus(Request $request, $id)
    {
        $appoint = Appointment::where('room', $id)->get();
        $status = $request->all();
        foreach ($appoint as $value)
        {
            $value->status = $status['status'];
            $value->save();
        }
        return "Sucess updating user ";

    }

    public function store(Request $request)
    {
        $newApp = $request->all();
        $appointment = new Appointment;

        $appointment->patients = $newApp['patients'];
        $appointment->room = $newApp['room'];
        $appointment->status = $newApp['status'];
        $appointment->slot = $newApp['slot'];

        $appointment->save();
    }


    public function update(Request $request, $id)
    {

        $updateRoom = $request->all();
        $room = Room::find($id);

        $room->name = $updateRoom['name'];
        $room->password = $updateRoom['password'];
        $room->email = $updateRoom['email'];
        $room->phone = $updateRoom['phone'];
        $room->save();

        return "Sucess updating user ";
    }


    public function destroy($id)
    {
        $room = Room::find($id);
        $room->delete();
        return Response::json(array('success delete room ' + $id => true));
    }
}
