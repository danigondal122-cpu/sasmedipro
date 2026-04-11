<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Module;
use App\Enums\RoleEnum;
use App\Models\Address;
use App\Models\Company;
use App\Models\BankDetail;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{


public function run(): void
    {

 $admin = User::factory()->create([
            'name' => RoleEnum::ADMIN,
            'email' => 'admin@example.com',
            'password' => Hash::make('123456789'),
          
            'status' => true,
        ]);
       
    }
    

}