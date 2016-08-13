<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Faculty;

use App\Http\Requests;

class FacultyController extends Controller
{
    
    
    public function show()
    {
        return Faculty::all();
    }
}
