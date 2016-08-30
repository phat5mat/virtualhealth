<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use \Znck\Eloquent\Relations\BelongsToThrough;
use App\Doctor;
use App\Room;

class Appointment extends Model
{
    public function room(){
        return $this->belongsTo('App\Room','room');
    }
    public function patient(){
        return $this->belongsTo('App\Patient','patients');
    }

   
    protected $table = 'appointment';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}
