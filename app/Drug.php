<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Examination;

class Drug extends Model
{

    public function prescription(){
        return $this->belongsTo('App\Prescription','prescription');
    }

    protected $table = 'drug';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}