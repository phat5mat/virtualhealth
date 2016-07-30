<?php

use Illuminate\Database\Seeder;
use App\User;

class Users extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        foreach(range(1,10) as $index)
        {
            User::create([
                'username' => $faker->userName,
                'name' =>$faker->name,
                'email' =>$faker->email,
                'phone' =>$faker->phoneNumber,
                'password' =>bcrypt('secret'),
                'balance' =>$faker->numberBetween($min = 0, $max = 1000 ),
                'dateOfBirth' =>$faker->date($format = 'y-m-d',$max = '1995-01-01'),


            ]);
        }
    }

   
}
