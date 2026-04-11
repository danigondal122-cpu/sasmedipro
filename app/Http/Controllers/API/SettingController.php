<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    /**
     * Get all settings (grouped by group)
     */
    public function index()
    {
        $settings = Setting::all();

        $formatted = [];

        foreach ($settings as $setting) {
            $formatted[$setting->name] = $setting->val;
        }

        return response()->json([
            'isSuccess' => true,
            'data' => $formatted
        ]);
    }

    /**
     * Update single setting
     */
    public function update($name, Request $request)
    {
        $request->validate([
            'val' => 'nullable|string'
        ]);

        $setting = Setting::where('name', $name)->first();

        if (!$setting) {
            return response()->json([
                'isSuccess' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $setting->val = $request->val;
        $setting->updated_by = Auth::id();
        $setting->save();

        return response()->json([
            'isSuccess' => true,
            'message' => 'Setting updated successfully',
            'data' => $setting
        ]);
    }

    /**
     * Bulk update settings
     */
   public function bulkUpdate(Request $request)
{
    $data = $request->all();

    foreach ($data as $name => $value) {
        Setting::where('name', $name)->update([
            'val' => $value,
            'updated_by' => Auth::id()
        ]);
    }

    // Return fresh settings
    $settings = Setting::all();

    $formatted = [];

    foreach ($settings as $setting) {
        $formatted[$setting->name] = $setting->val;
    }

    return response()->json([
        'isSuccess' => true,
        'message' => 'Settings updated successfully',
        'data' => $formatted
    ]);
}
}
