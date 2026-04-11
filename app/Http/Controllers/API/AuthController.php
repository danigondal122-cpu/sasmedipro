<?php

namespace App\Http\Controllers\API;

use Exception;
use Carbon\Carbon;
use App\Models\Address;
use App\Models\Company;
use App\Enums\RoleEnum;
use App\Events\CreateUserEvent;
use App\Events\CreateProviderEvent;
use App\Helpers\Helpers;
use App\Mail\ForgotPassword;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\SocialLoginRequest;
use App\Models\ProviderWallet;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use App\Traits\FormatsLabels;


class AuthController extends Controller
{

 use FormatsLabels;


  public function login(Request $request)
{
    try {
        $user = $this->verifyLogin($request);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => __('passwords.incorrect_password'),
            ], 400);
        }

          $role = $user->getRoleNames()->first(); 

          $permissions = $user->getAllPermissions()->pluck('name');

        // Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return full user info
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'access_token' => $token,
            
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => [
                'key' => $role ?? null,
                'label' => $role
                    ? $this->formatRoleLabel($role)
                    : 'No Role Assigned',
            ],
         'permissions' => $permissions,
            ],
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], $e->getCode() >= 400 ? $e->getCode() : 500);
    }
}

  

    // private function createOrGetUser($loginMethod, $user)
    // {
    //     if ($loginMethod === 'phone') {
    //         $phone = $user->phone;
    //         $code = $user->code;

    //         $existingUser = User::where('phone', $phone)->first();

    //         if ($existingUser) {
    //             return $existingUser;
    //         }

    //         $newUser = User::create([
    //             'status' => true,
    //             'phone' => $phone,
    //             'code' => $code,
    //         ]);

    //     } else {
    //         $email = $user->email;
    //         $name = $user->name;

    //         $existingUser = User::where('email', $email)->first();

    //         if ($existingUser) {
    //             return $existingUser;
    //         }

    //         $newUser = User::create([
    //             'status' => true,
    //             'email' => $email ?? null,
    //             'name' => $name ?? null,
    //         ]);
    //     }

    //     $userRole = Role::where('name', RoleEnum::CONSUMER)->first();
    //     if ($userRole) {
    //         $newUser->assignRole($userRole);
    //     }

    //     return $newUser;

    // }

   public function verifyLogin(Request $request): User
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        throw new \Exception($validator->messages()->first(), 422);
    }

    $user = User::where('email', $request->email)
        ->where('status', true)
        ->first();

    if (!$user) {
        throw new \Exception(__('validation.user_not_exists'), 400);
    }

    return $user;
}






   public function logout(Request $request)
{
    try {
        $token = PersonalAccessToken::findToken($request->bearerToken());

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => __('auth.token_invalid'),
            ], 400);
        }

        $token->delete();

        return response()->json([
            'success' => true,
            'message' => __('auth.logged_out'),
        ]);

    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


  

   
}
