<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{


    public function register(): void
    {

    }



    public function boot(): void
    {
        Gate::define('manage-brands', function (User $user) {
            return $user->isAdmin() && $user->isActive();
        });
    }
}
