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
       Schema::create('sale_meta', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('sale_id'); // link to the sale
    $table->string('sales_person')->nullable();
    $table->enum('payment_type', ['cash', 'card','bank_transfer', 'credit']); // mandatory
    $table->decimal('due_amount', 12, 2)->default(0); // only used for credit
    $table->string('whs')->nullable(); // warehouse
    $table->string('uom')->nullable(); // unit of measure
    $table->date('due_date')->nullable();
   
    $table->timestamps();

    $table->foreign('sale_id')->references('id')->on('sales')->onDelete('cascade');
     $table->unique('sale_id');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_meta', function (Blueprint $table) {
            //
        });
    }
};
