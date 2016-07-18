<?php

use Illuminate\Database\Seeder;
use App\Doctor;

class Doctors extends Seeder
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
            Doctor::create([
                'docid' =>$faker->userName,
                'docname' =>$faker->name,
                'docemail' =>$faker->email,
                'docphone' =>$faker->phoneNumber,
                'docpassword' =>bcrypt('secret'),
                'docbiography' => $faker->paragraph($nbSentences = 3),
                'docbalance' =>$faker->numberBetween($min = 0, $max = 1000 ),
                'docage' =>$faker->numberBetween($min = 20,$max = 60),
                'docstatus' =>$faker->numberBetween($min = 0,$max = 1)


            ]);
        }
    }
}
