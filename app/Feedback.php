<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{

    public function doctor(){
        return $this->belongsTo('App\Doctor','doctor');
    }

    protected $table = 'feedback';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $incrementing = false;

}