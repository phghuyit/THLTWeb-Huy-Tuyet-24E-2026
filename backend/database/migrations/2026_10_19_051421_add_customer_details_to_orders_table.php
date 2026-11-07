<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('receiver_name')->nullable()->after('user_id');
            $table->string('receiver_phone', 30)->nullable()->after('receiver_name');
            $table->text('address')->nullable()->after('receiver_phone');
            $table->string('payment_method', 30)->default('cod')->after('address');
            $table->bigInteger('total_amount')->default(0)->after('payment_method');
            $table->text('note')->nullable()->after('total_amount');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'receiver_name',
                'receiver_phone',
                'address',
                'payment_method',
                'total_amount',
                'note',
            ]);
        });
    }
};
