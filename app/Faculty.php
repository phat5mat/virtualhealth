<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    public function doctor(){
        return $this->hasMany('App\Doctor','faculty');
    }
    protected $table = 'faculty';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
