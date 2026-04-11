<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Traits\FormatsLabels;

class RoleManagementController extends Controller
{
use FormatsLabels;

private function formatPermissionLabel($permission)
{
    // backend.user.edit
    $parts = explode('.', $permission);

    if (count($parts) !== 3) {
        return ucfirst(str_replace('.', ' ', $permission));
    }

    [$area, $module, $action] = $parts;

    $module = str_replace('_', ' ', $module);

    $actionMap = [
        'index' => 'View',
        'create' => 'Create',
        'edit' => 'Edit',
        'destroy' => 'Delete',
    ];

    $actionLabel = $actionMap[$action] ?? ucfirst($action);

    return ucfirst($module) . ' - ' . $actionLabel;
}



    public function __construct()
    {
        $this->middleware('permission:backend.role.index')->only('index');
        $this->middleware('permission:backend.role.create')->only('store');
        $this->middleware('permission:backend.role.edit')->only('update');
        $this->middleware('permission:backend.role.destroy')->only('destroy');
    }

    /**
     * List all roles with permissions
     */
  public function index()
{
    $roles = Role::with('permissions')->get()->map(function ($role) {
        return [
            'id' => $role->id,
            'key' => $role->name,
            'label' => $this->formatRoleLabel($role->name),
            'system_reserve' => $role->system_reserve ?? 0,
            'permissions' => $role->permissions->pluck('name'),
            'created_at' => $role->created_at,
        ];
    });

    $allPermissions = Permission::all()->map(function ($permission) {
        return [
            'key' => $permission->name,
            'label' => $this->formatPermissionLabel($permission->name),
        ];
    });

    return response()->json([
        'isSuccess' => true,
        'data' => [
            'roles' => $roles,          // ✅ correct
            'permissions' => $allPermissions,
        ]
    ]);
}

    /**
     * Create new role and assign permissions
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'sanctum',
        ]);

        $role->syncPermissions($validated['permissions']);

        return response()->json([
            'isSuccess' => true,
            'message' => 'Role created successfully',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ]
        ], 201);
    }

    /**
     * Update role permissions
     */
    public function update(Request $request, $id)
    {
      
        $role = Role::findOrFail($id);

        if ($role->system_reserve) {
            return response()->json([
                'isSuccess' => false,
                'message' => 'Cannot modify a system reserved role.'
            ], 403);
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        $role->syncPermissions($validated['permissions']);

        return response()->json([
            'isSuccess' => true,
            'message' => 'Role updated successfully',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ]
        ]);
    }

    /**
     * Delete role
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if ($role->system_reserve) {
            return response()->json([
                'isSuccess' => false,
                'message' => 'Cannot delete a system reserved role.'
            ], 403);
        }

        $role->delete();

        return response()->json([
            'isSuccess' => true,
            'message' => 'Role deleted successfully'
        ]);
    }
}
