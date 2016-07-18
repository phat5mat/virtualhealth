<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'doctor';
    protected $primaryKey = 'docid';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = ['appid','docname','docpassword'];
}
