<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Carbon;

use Laravel\Sanctum\PersonalAccessToken;

class LoginController extends Controller
{
    // use AuthenticatesUsers;

   /**
     * Handle a login request to the application.
     */


    public function login(Request $request)
    {
        // Validate email & password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'isSuccess' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

$expiresAt = Carbon::now()->addMinutes(1);
$tokenResult = $user->createToken('access_token'.['*'],$expiresAt);
$plainTextToken = $tokenResult->plainTextToken;


        return response()->json([
            'isSuccess' => true,
            'message' => 'Login successful',
           'access_token' =>  $plainTextToken,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Log the user out and revoke tokens.
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->tokens()->delete(); // revoke all API tokens
        }

        return response()->json([
            'isSuccess' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Redirect users after login based on role.
     */
    // public function authenticated(Request $request, $user)
    // {
    //     if ($user->hasRole('user')) {
    //         return redirect()->route('frontend.home');
    //     }
    //     return redirect()->route('backend.dashboard');
    // }

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        // Removed guest middleware
    }

    /**
     * Show the admin login form.
     */
    public function showAdminLogin()
    {
        return view('auth.login');
    }

   
}
