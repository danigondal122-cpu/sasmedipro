<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Module;
use App\Enums\RoleEnum;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'roles' => ['actions' => ['index' => 'backend.role.index', 'create' => 'backend.role.create', 'edit' => 'backend.role.edit', 'destroy' => 'backend.role.destroy']],
            'users' => ['actions' => ['index' => 'backend.user.index', 'create' => 'backend.user.create', 'edit' => 'backend.user.edit', 'destroy' => 'backend.user.destroy']],
            'settings' => ['actions' => ['index' => 'backend.setting.index', 'create' => 'backend.setting.create', 'edit' => 'backend.setting.edit', 'destroy' => 'backend.setting.destroy']],
            'push_notifications' => ['actions' => ['index' => 'backend.push_notification.index', 'create' => 'backend.push_notification.create', 'edit' => 'backend.push_notification.edit', 'destroy' => 'backend.push_notification.destroy']],
            'email_templates' => ['actions' => ['index' => 'backend.email_template.index', 'edit' => 'backend.email_template.edit']],
            'push_notification_templates' => ['actions' => ['index' => 'backend.push_notification_template.index', 'edit' => 'backend.push_notification_template.edit']],
        ];

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1️⃣ Insert modules in bulk
        $modulesData = [];
        foreach ($modules as $key => $value) {
            $modulesData[] = [
                'name' => $key,
                'actions' => json_encode($value['actions']),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // 2️⃣ Create permissions if not exist
            foreach ($value['actions'] as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName],['guard_name' => 'web']);
            }
        }
        Module::insert($modulesData);

        // 3️⃣ Create roles
        $adminRole = Role::firstOrCreate(['name' => RoleEnum::ADMIN], [  'guard_name' => 'web','system_reserve' => true]);
        $userRole = Role::firstOrCreate(['name' => RoleEnum::USER], [  'guard_name' => 'web','system_reserve' => true]);

        // 4️⃣ Assign permissions safely
        $allPermissionNames = Permission::pluck('name')->toArray();
        $adminRole->syncPermissions($allPermissionNames);

      
    }
}
