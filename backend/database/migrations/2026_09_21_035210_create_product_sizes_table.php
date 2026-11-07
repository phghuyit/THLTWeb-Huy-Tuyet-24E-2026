<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->enum('size', ['XS', 'S', 'M', 'L', 'XL', '2XL', 'FreeSize'])->default('FreeSize');
            $table->integer('stock_quantity')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['product_id', 'size'], 'unique_product_size');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};
