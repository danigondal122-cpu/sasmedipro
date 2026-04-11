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
       Schema::create('deliveries', function (Blueprint $table) {
    $table->id();

    $table->foreignId('sale_id')->unique()->constrained()->cascadeOnDelete();
    // unique → ensures ONE delivery per sale

    $table->foreignId('delivered_by')->nullable()->constrained('users');

    $table->string('status')->default('pending');
    // pending | shipped | delivered | failed

    $table->boolean('inventory_deducted')->default(false);

    $table->timestamp('delivered_at')->nullable();
    $table->text('notes')->nullable();

    $table->timestamps();
    $table->softDeletes();
});



    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery', function (Blueprint $table) {
            //
        });
    }
};
