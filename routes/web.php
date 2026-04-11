<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\File;

// Route::get('/', function () {
//     return view('welcome');
// });


Route::get('/', function () {
    return response()->file(public_path('index.html'));
});

// Catch only NON-API routes
Route::get('/{any}', function () {
    return response()->file(public_path('index.html'));
})->where('any', '^(?!api).*$');