<?php

namespace App\Http\Controllers;

use App\Doctor;
use Response;

use Illuminate\Http\Request;

use App\Http\Requests;

class DoctorsController extends Controller
{
    public function index(){
        $doctors = Doctor::all();
        return Response::json([
            'data' => $this->transformCollection($doctors)
        ], 200);
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

    public function transformCollection($doctors){
        return array_map([$this,'transform'], $doctors->toArray());

    }

    public function transform($doctor){
        return [
            'ID' => $doctor['docid'],
            'Name' => $doctor['docname']
        ];
    }

    public function destroy($id)
    {
        Joke::destroy($id);
    }

}

