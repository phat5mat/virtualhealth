<?php

namespace App\Http\Controllers;

use App\Professional;
use Illuminate\Http\Request;
use App\Speciality;

use App\Http\Requests;

class SpecialityController extends Controller
{
    
    
    public function show()
    {
        return Speciality::all();
    }

    public function findSpeciaByDoctor($id){
        $spec = Professional::where('doctor',$id)
            ->with('speciality')
            ->get();
        return $spec;
    }
    
   
}
