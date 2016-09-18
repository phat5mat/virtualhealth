<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Examination;

class Prescription extends Model
{

    public function examination(){
        return $this->belongsTo('App\Examination','examination');
    }
    public function drug(){
        return $this->hasMany('App\Drug','prescription');
    }
    

    protected $table = 'prescription';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}
