<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;

return new class extends Migration {
    public function up()
    {
        // Items table
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('item_no')->unique();
            $table->string('item_name');
            $table->string('slug')->unique(); 
            $table->decimal('price', 10, 2);
            $table->decimal('tax', 5, 2)->default(0);
            $table->string('batch_number')->nullable(); // ✅ new batch number
            $table->date('expiry_date')->nullable();    // ✅ new expiry date
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('status')->default(true); // true = active
            $table->timestamps();
             $table->softDeletes();
        });

        // Inventories table
      
    }

    public function down()
    {
       
        Schema::dropIfExists('items');
    }
};
