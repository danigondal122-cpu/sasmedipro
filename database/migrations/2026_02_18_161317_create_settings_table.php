<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique(); // setting key
            $table->string('group')->default('general')->nullable(); 
            $table->text('val')->nullable(); // setting value

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamps();

            // Optional foreign keys (recommended if you have users table)
            $table->foreign('created_by')
                  ->references('id')
                  ->on('users')
                  ->nullOnDelete();

            $table->foreign('updated_by')
                  ->references('id')
                  ->on('users')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
