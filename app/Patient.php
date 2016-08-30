<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    public function appointment(){
        return $this->hasMany('App\Appointment','patients');
    }

    public function user(){
        return $this->belongsTo('App\User','users');
    }
    
    protected $table = 'patient';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
