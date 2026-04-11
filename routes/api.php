<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\RoleManagementController;
use App\Http\Controllers\API\DeliveryController;



Route::group(['middleware' => []], function () {

    Route::post('/login', 'App\Http\Controllers\API\AuthController@login');  
    Route::get('/logout', 'App\Http\Controllers\API\AuthController@logout');

   

});


Route::prefix('items')
    ->middleware(['auth:sanctum'])
    ->group(function () {

        Route::get('/', 
            'App\Http\Controllers\API\ItemController@index'
        )->middleware('permission:backend.item.index');

        Route::get('{id}', 
            'App\Http\Controllers\API\ItemController@show'
        )->middleware('permission:backend.item.index');

        Route::post('/', 
            'App\Http\Controllers\API\ItemController@store'
        )->middleware('permission:backend.item.create');

        Route::put('{id}', 
            'App\Http\Controllers\API\ItemController@update'
        )->middleware('permission:backend.item.edit');

           Route::delete('bulk-delete', 
    'App\Http\Controllers\API\ItemController@bulkDestroy'
)->middleware('permission:backend.item.destroy');

        Route::delete('{id}', 
            'App\Http\Controllers\API\ItemController@destroy'
        )->middleware('permission:backend.item.destroy');

     
    });



    Route::prefix('purchases')
    ->middleware(['auth:sanctum'])
    ->group(function () {

        Route::get('/', 'App\Http\Controllers\API\PurchaseController@index');
        Route::get('{id}', 'App\Http\Controllers\API\PurchaseController@show');
        Route::post('/', 'App\Http\Controllers\API\PurchaseController@store');
        Route::put('{id}', 'App\Http\Controllers\API\PurchaseController@update');
        Route::delete('{id}', 'App\Http\Controllers\API\PurchaseController@destroy');
        Route::post('bulk-delete', 'App\Http\Controllers\API\PurchaseController@bulkDestroy');
    });


Route::prefix('inventories')->middleware('auth:sanctum')->group(function () {
    Route::get('/', 'App\Http\Controllers\API\InventoryController@index')->middleware('permission:backend.inventory.index');     // List inventories
    Route::get('{id}', 'App\Http\Controllers\API\InventoryController@show')->middleware('permission:backend.inventory.index');    // Show single inventory
    Route::post('/', 'App\Http\Controllers\API\InventoryController@store')->middleware('permission:backend.inventory.create');     // Create inventory
    Route::put('{id}', 'App\Http\Controllers\API\InventoryController@update')->middleware('permission:backend.inventory.edit');  // Update inventory
    Route::delete('bulk-delete', 
            'App\Http\Controllers\API\InventoryController@bulkDestroy'
        )->middleware('permission:backend.inventory.destroy');
    Route::delete('{id}', 'App\Http\Controllers\API\InventoryController@destroy')->middleware('permission:backend.inventory.destroy'); // Delete inventory
});






// Sales routes


// Sale Items routes
Route::prefix('sales')->middleware('auth:sanctum')->group(function () {
    Route::get('/', 'App\Http\Controllers\API\SaleController@index')->middleware('permission:backend.sale.index');       // List sale items
     Route::get('reports', 'App\Http\Controllers\API\SaleController@reports')->middleware('permission:backend.sale.index');


    Route::get('{id}', 'App\Http\Controllers\API\SaleController@show')->middleware('permission:backend.sale.index');   // Show single sale item
    Route::post('/', 'App\Http\Controllers\API\SaleController@store')->middleware('permission:backend.sale.create');     // Create sale item
    Route::put('{id}', 'App\Http\Controllers\API\SaleController@update')->middleware('permission:backend.sale.edit');  // Update sale item
      Route::patch('bulk-status',
        'App\Http\Controllers\API\SaleController@bulkUpdateStatus'
    )->middleware('permission:backend.sale.edit');
    
    // ✅ BULK DELETE
    Route::delete('bulk-delete',
        'App\Http\Controllers\API\SaleController@bulkDestroy'
    )->middleware('permission:backend.sale.destroy');
    Route::delete('{id}', 'App\Http\Controllers\API\SaleController@destroy')->middleware('permission:backend.sale.destroy'); // Delete sale item
});









// Loan Management routes
Route::prefix('loans')->middleware('auth:sanctum')->group(function () {

    // List all loans
    Route::get('/', 'App\Http\Controllers\API\LoanController@index');
     Route::post('/', 'App\Http\Controllers\API\LoanController@store');
        

    // Loan reports (e.g., monthly, daily)
    Route::get('reports', 'App\Http\Controllers\API\LoanController@reports');
       

    // Show single loan details
    Route::get('{id}', 'App\Http\Controllers\API\LoanController@show');
       
    // Create new loan
   
      

    // Update existing loan
    Route::put('{id}', 'App\Http\Controllers\API\LoanController@update');
      

    // Record a repayment for a loan
    Route::post('{id}/repayments', 'App\Http\Controllers\API\LoanController@addRepayment');
       

    // Bulk update loan status
    Route::patch('bulk-status', 'App\Http\Controllers\API\LoanController@bulkUpdateStatus');
     

    // Bulk delete loans
    Route::delete('bulk-delete', 'App\Http\Controllers\API\LoanController@bulkDestroy');
      

    // Delete single loan
    Route::delete('{id}', 'App\Http\Controllers\API\LoanController@destroy');
     
});



Route::prefix('customer-payment')->middleware('auth:sanctum')->group(function () {
    Route::get('/', 'App\Http\Controllers\API\CustomerPaymentController@index')->middleware('permission:backend.customer.index'); // List all payments
    Route::get('{id}', 'App\Http\Controllers\API\CustomerPaymentController@show')->middleware('permission:backend.customer.index'); // Show single payment
});



Route::prefix('analytics')->group(function () {
    Route::get('/totals', 'App\Http\Controllers\API\AnalyticsController@total');
    Route::get('/reports','App\Http\Controllers\API\AnalyticsController@reports');
});










Route::prefix('customers')->middleware('auth:sanctum')->group(function () {
    Route::get('/', 'App\Http\Controllers\API\CustomerController@index')->middleware('permission:backend.customer.index');      // List customers
    Route::get('{id}', 'App\Http\Controllers\API\CustomerController@show')->middleware('permission:backend.customer.index');    // Show single customer
    Route::post('/', 'App\Http\Controllers\API\CustomerController@store')->middleware('permission:backend.customer.create');    // Create customer
    Route::put('{id}', 'App\Http\Controllers\API\CustomerController@update')->middleware('permission:backend.customer.edit'); // Update customer
    Route::delete('{id}', 'App\Http\Controllers\API\CustomerController@destroy')->middleware('permission:backend.customer.destroy'); // Delete customer
});





   



Route::prefix('admin')
    ->middleware(['auth:sanctum'])
    ->group(function () {

        // User management routes with permission checks
        Route::get('/users', [\App\Http\Controllers\API\Admin\UserManagementController::class, 'index'])
            ->middleware('permission:backend.user.index');

        Route::post('/users', [\App\Http\Controllers\API\Admin\UserManagementController::class, 'store'])
            ->middleware('permission:backend.user.create');

        Route::put('/users/{id}', [\App\Http\Controllers\API\Admin\UserManagementController::class, 'update'])
            ->middleware('permission:backend.user.edit');

        Route::delete('/users/{id}', [\App\Http\Controllers\API\Admin\UserManagementController::class, 'destroy'])
            ->middleware('permission:backend.user.destroy');
    });

/*  ADMIN  ROUTES  */


Route::prefix('admin')
    ->middleware(['auth:sanctum'])
    ->group(function () {
      




             Route::get('/settings', [App\Http\Controllers\API\SettingController::class, 'index'])->middleware('permission:backend.setting.index');;

        Route::put('/settings/{name}', [App\Http\Controllers\API\SettingController::class, 'update'])->middleware('permission:backend.setting.edit');;

        Route::put('/settings', [App\Http\Controllers\API\SettingController::class, 'bulkUpdate'])->middleware('permission:backend.setting.edit');;



    });





Route::prefix('admin')
    ->middleware(['auth:sanctum'])
    ->group(function () {

        Route::get('/roles', [RoleManagementController::class, 'index'])
            ->middleware('permission:backend.role.index');

        Route::post('/roles', [RoleManagementController::class, 'store'])
            ->middleware('permission:backend.role.create');

        Route::put('/roles/{id}', [RoleManagementController::class, 'update'])
            ->middleware('permission:backend.role.edit');

        Route::delete('/roles/{id}', [RoleManagementController::class, 'destroy'])
            ->middleware('permission:backend.role.destroy');
    });




    Route::prefix('deliveries')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/', [DeliveryController::class, 'index']);          // List all deliveries
    Route::get('/{delivery}', [DeliveryController::class, 'show']); // Get single delivery
    //Route::post('/', [DeliveryController::class, 'store']);         // Create delivery
    Route::put('/{delivery}/status', [DeliveryController::class, 'updateStatus']); // Update delivery status
     Route::delete('/bulk-delete', [DeliveryController::class, 'bulkDelete']);
    Route::patch('/bulk-status', [DeliveryController::class, 'bulkUpdateStatus']);
    Route::delete('/{delivery}', [DeliveryController::class, 'destroy']);         // Delete delivery
    
});






    