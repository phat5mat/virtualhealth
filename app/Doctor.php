<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctor';
    protected $primaryKey = 'docid';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = ['docid','docname','docpassword','docbalance',
        'docbio','docbiography','docemail','docphone','docage'];
}
