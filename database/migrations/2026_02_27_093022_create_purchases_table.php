<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
             $table->string('purchase_no')->after('id')->unique()->nullable();

            $table->string('product_name');
            $table->decimal('price', 10, 2);          // price per unit
            $table->integer('amount');                // quantity purchased
            $table->decimal('shipping', 10, 2)->default(0);
            $table->decimal('total', 12, 2);          // final total

            $table->timestamps();
            $table->softDeletes(); // optional (if you want soft delete)
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchases');
    }
};