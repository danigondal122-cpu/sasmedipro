<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('sales', function (Blueprint $table) {
    $table->id();
    $table->string('invoice_no')->unique();
    
    $table->foreignId('customer_id')
              ->nullable()
              ->constrained('customers')
              ->nullOnDelete();

        // Seller (also from customers table)
        $table->foreignId('seller_id')
          ->nullable()
          ->constrained('users')
          ->nullOnDelete();

    $table->decimal('total_amount', 12, 2)->default(0);
    $table->enum('status', [ 'confirmed', 'delivered', 'cancelled'])->default('confirmed');

     $table->enum('payment_status', [
                'unpaid',
                'partially_paid',
                'paid'
            ])->default('unpaid');

            
    $table->unsignedBigInteger('created_by_id')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('created_by_id')->references('id')->on('users')->onDelete('set null');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      
    }
};
