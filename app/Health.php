<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Health extends Model
{

    public function patient(){
        return $this->belongsTo('App\Patient','patient');
    }

    protected $table = 'health_stats';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}
