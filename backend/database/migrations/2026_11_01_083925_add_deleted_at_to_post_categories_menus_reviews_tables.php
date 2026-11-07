<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('post_categories') && !Schema::hasColumn('post_categories', 'deleted_at')) {
            Schema::table('post_categories', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (Schema::hasTable('menus') && !Schema::hasColumn('menus', 'deleted_at')) {
            Schema::table('menus', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (Schema::hasTable('reviews') && !Schema::hasColumn('reviews', 'deleted_at')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('post_categories') && Schema::hasColumn('post_categories', 'deleted_at')) {
            Schema::table('post_categories', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('menus') && Schema::hasColumn('menus', 'deleted_at')) {
            Schema::table('menus', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('reviews') && Schema::hasColumn('reviews', 'deleted_at')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
