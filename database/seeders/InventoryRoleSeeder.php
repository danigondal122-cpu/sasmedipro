<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Enums\RoleEnum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class InventoryRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles & permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1️⃣ Create permissions if not exist
        $permissions = [
            'backend.inventory.index',
            'backend.inventory.create',
            'backend.inventory.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // 2️⃣ Create Inventory Manager Role
        $inventoryRole = Role::firstOrCreate(
            ['name' => RoleEnum::INVENTORY_MANAGER->value],
            ['guard_name' => 'web']
        );

        // 3️⃣ Assign limited permissions
        $inventoryRole->syncPermissions($permissions);
    }
}
