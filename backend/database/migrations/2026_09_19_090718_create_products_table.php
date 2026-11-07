<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('brand_id')->nullable();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('thumbnail', 255);
            $table->string('short_description', 500)->nullable();
            $table->longText('description')->nullable();
            $table->decimal('rental_price_per_day', 12, 2)->default(0.00);
            $table->decimal('sale_rental_price', 12, 2)->nullable();
            $table->decimal('deposit_price', 12, 2)->default(0.00);
            $table->decimal('original_value', 12, 2)->default(0.00);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_sale')->default(false);
            $table->integer('view_count')->default(0);
            $table->enum('status', ['active', 'hidden'])->default('active');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('category_id')->references('id')->on('categories')->restrictOnDelete();
            $table->foreign('brand_id')->references('id')->on('brands')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
