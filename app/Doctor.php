<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{

    public function room(){
        return $this->hasMany('App\Room','doctor');
    }
    public function appointment(){
        return $this->hasManyThrough('App\Appointment','App\Room','doctor','room');
    }
    
    public function user(){
        return $this->belongsTo('App\User','users');
    }
    
    public function professional(){
        return $this->hasMany('App\Professional','doctor');
    }

    protected $table = 'doctors';
    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = ['users', 'biography','status','certification','experience'];


}
