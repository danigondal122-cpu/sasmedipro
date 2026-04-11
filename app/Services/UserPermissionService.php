<?php


namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserPermissionService
{
    public function assignRole(User $user, string $roleName): void
    {
        $role = Role::where('name', $roleName)->firstOrFail();
        $user->assignRole($role);
    }

    public function syncRoles(User $user, array $roles): void
    {
        $user->syncRoles($roles);
    }

    public function givePermission(User $user, string $permission): void
    {
        $permissionModel = Permission::where('name', $permission)->firstOrFail();
        $user->givePermissionTo($permissionModel);
    }

    public function syncPermissions(User $user, array $permissions): void
    {
        $user->syncPermissions($permissions);
    }

    public function revokePermission(User $user, string $permission): void
    {
        $user->revokePermissionTo($permission);
    }
}
