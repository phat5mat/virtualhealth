<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    public function appointment(){
        return $this->hasMany('App\Appointment','patients');
    }
    
    protected $table = 'patient';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
