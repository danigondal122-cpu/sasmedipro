<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        

        // Inventories table
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->integer('qty');
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('status')->default(true); // true = active
             $table->unique('item_id');
             $table->timestamps();
             $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
      
    }
};
