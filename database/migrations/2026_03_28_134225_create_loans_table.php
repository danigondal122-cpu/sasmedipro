<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('loan_no', 50)->unique();
            $table->string('lender_name', 255);
    $table->string('borrower_name', 255);
            $table->decimal('principal_amount', 15, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('total_amount_due', 15, 2);
            $table->decimal('remaining_balance', 15, 2);
            $table->date('start_date');
            $table->enum('status', ['active', 'paid', 'defaulted'])->default('active');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            // $table->index('lender_id');
            // $table->index('borrower_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};