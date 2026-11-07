<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `reviews` MODIFY COLUMN `status` ENUM('pending', 'approved', 'hidden') NOT NULL DEFAULT 'approved'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `reviews` MODIFY COLUMN `status` ENUM('approved', 'hidden') NOT NULL DEFAULT 'approved'");
    }
};
