<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    public function appointment(){
        return $this->hasMany('App\Appointment','room');
    }
    public function doctor(){
        return $this->belongsTo('App\Doctor','doctor');
    }

    public function speciality(){
        return $this->belongsTo('App\Speciality','speciality');
    }

    protected $table = 'room';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
