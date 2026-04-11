<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use App\Traits\FormatsLabels;

class UserManagementController extends Controller
{

 use FormatsLabels;

    public function __construct()
    {
      
    }



  public function index(Request $request)
{




    $users = User::with('roles')
        ->when($request->search, function ($query) use ($request) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        })
        ->latest()
        ->paginate($request->per_page ?? 10);


    return response()->json([
        'isSuccess' => true,
        'data' => $users->getCollection()->map(function ($user) {
            
        $roleName = $user->getRoleNames()->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
               'role' => [
    'key' => $roleName ?? null,
    'label' => $roleName
        ? $this->formatRoleLabel($roleName)
        : 'No Role Assigned',
],
                'created_at' => $user->created_at,
            ];
        }),
        'meta' => [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
        ]
    ]);
}

    /**
     * Create new user and assign role
     */
   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'role' => ['required', Rule::exists('roles', 'name')],
        'status' => 'nullable|boolean',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'status' => $validated['status'] ?? true,
    ]);

    // Ensure single role
    $user->syncRoles([$validated['role']]);

    return response()->json([
        'isSuccess' => true,
        'message' => 'User created successfully',
        'data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(),
            'created_at' => $user->created_at,
        ]
    ], 201);
}

    /**
     * Update user & role
     */
 public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => ['sometimes','required','email', Rule::unique('users')->ignore($user->id)],
        'password' => 'nullable|string|min:6',
        'role' => ['nullable', Rule::exists('roles', 'name')],
        'status' => 'nullable|boolean',
    ]);

    if (!empty($validated['password'])) {
        $validated['password'] = Hash::make($validated['password']);
    } else {
        unset($validated['password']);
    }

    $user->update($validated);

    if (isset($validated['role'])) {
        $user->syncRoles([$validated['role']]);
    }

    return response()->json([
        'isSuccess' => true,
        'message' => 'User updated successfully',
        'data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(),
            'created_at' => $user->created_at,
        ]
    ]);
}

    /**
     * Delete user
     */
public function destroy($id)
{
    $user = User::with('roles')->findOrFail($id);

    // Check if any of the user's roles are system reserved
    $hasSystemReservedRole = $user->roles->contains(function ($role) {
        return $role->system_reserve == 1;
    });

    if ($hasSystemReservedRole) {
        return response()->json([
            'isSuccess' => false,
            'message' => 'Cannot delete a user with a system reserved role.'
        ], 403); // Forbidden
    }

    $user->delete();

    return response()->json([
        'isSuccess' => true,
        'message' => 'User deleted successfully'
    ]);
}



}
