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
       Schema::create('sale_items', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('sale_id');
    $table->unsignedBigInteger('item_id');
    $table->integer('qty');
    $table->decimal('price', 10, 2);
    $table->decimal('tax', 5, 2)->default(0);
    $table->decimal('subtotal', 12, 2);
    $table->softDeletes();
    $table->timestamps();

    $table->foreign('sale_id')->references('id')->on('sales')->onDelete('cascade');
    $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
     
    }
};
