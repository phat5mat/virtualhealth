<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Speciality extends Model
{
    public function doctor(){
        return $this->hasMany('App\Doctor','speciality');
    }
    public function professional(){
        return $this->hasMany('App\Professional','speciality');
    }
    protected $table = 'speciality';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
