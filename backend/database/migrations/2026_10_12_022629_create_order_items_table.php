<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{


    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_size_id')->constrained('product_sizes')->restrictOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->date('rent_start_date');
            $table->date('rent_end_date');
            $table->unsignedInteger('rental_days');
            $table->decimal('price_per_day', 12, 2);
            $table->decimal('deposit_per_item', 12, 2);
            $table->decimal('total_item_rental', 12, 2);
            $table->decimal('total_item_deposit', 12, 2);
            $table->timestamps();
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
