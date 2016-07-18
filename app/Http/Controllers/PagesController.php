<?php

namespace App\Http\Controllers;

use App\Doctor;
use Illuminate\Http\Request;

use App\Http\Requests;

class PagesController extends Controller
{
    public function aboutme(){


            //Khai báo mảng dữ liệu
            $lists = array(
                'Language' => [
                    'PHP',
                    'Javascript',
                    'HTML',
                    'NodeJS'
                ],
                'Framework' => [
                    'Laravel 5',
                    'Yii',
                    'Phalcon'
                ]
            );
            dd($lists); //Sử dụng hàm dd để kiểm tra dữ liệu mảng


    }

    public function createView(){
        return view("create");
    }
    public function createAction(Request $request){
        $newDoc = $request->all();
        $doc = new Doctor;
        $doc->docpassword = $newDoc['pass'];
        $doc->docname = $newDoc['name'];
        $doc->docage = $newDoc['age'];
        $doc->docemail = $newDoc['email'];
        $doc->docphone = $newDoc['phone'];
        $doc->docid = $newDoc['username'];

        $doc->save();
        return view("aboutme")->with('name',$doc->docname);

    }
}
