<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Prescription;

class Examination extends Model
{
  
    public function prescription(){
        return $this->hasOne('App\Prescription','examination');
    }
    
    public function appointment(){
        return $this->hasOne('App\Appointment','examination');
    }
    
    protected $table = 'examination';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}
