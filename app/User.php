<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;


class User extends Model implements AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public function doctor(){
        return $this->hasOne('App\Doctor','users');
    }

    public function patient(){
        return $this->hasOne('App\Patient','users');
    }

    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $fillable = ['username', 'name','password','email','phone','avatar','balance','dateofbirth'];
    protected $hidden = ['password', 'remember_token'];


}
