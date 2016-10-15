<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Professional extends Model
{
    public function doctor(){
        return $this->belongsTo('App\Doctor','doctor');
    }
    public function speciality(){
        return $this->belongsTo('App\Speciality','speciality');
    }
    protected $table = 'professional';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
