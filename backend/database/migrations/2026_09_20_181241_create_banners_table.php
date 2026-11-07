<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100)->nullable();
            $table->string('image_url', 255);
            $table->string('link_url', 255)->nullable();
            $table->string('position', 50)
                ->default('home_main_slider');
            $table->integer('sort_order')->default(0);
            $table->enum('status', ['active', 'hidden'])
                ->default('active');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};