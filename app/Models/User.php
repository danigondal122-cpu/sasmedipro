<?php

namespace App\Models;

use Spatie\Permission\Traits\HasRoles;
use App\Enums\BookingEnumSlug;
use App\Enums\RoleEnum;
use App\Helpers\Helpers;
use Cviebrock\EloquentSluggable\Sluggable;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Subscription\Entities\UserSubscription;



class User extends Authenticatable 
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

      protected $guard_name = 'sanctum';


      
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'created_by',
        'current_password',
        'new_password',
        'confirm_password',
        
    ];

    protected $casts = [
       
       
        'status' => 'integer',
        'created_by' => 'integer',
    ];

    // protected $appends = [
    //     'role',
    //     'review_ratings',
    //     'provider_rating_list',
    //     'service_man_rating_list',
    //     'primary_address',
    //     'total_days_experience',
    //     'ServicemanReviewRatings',
    //     'is_favourite'
    // ];

    protected $with = [
        // 'media',
        // 'wallet',
        // 'providerWallet',
        // 'servicemanWallet',
        // 'knownLanguages:key,id',
        // 'expertise:title,id',
        // 'zones',
        // 'provider'
    ];

    protected $withCount = [];

    // public function sluggable(): array
    // {
    //     return [
    //         'slug' => [
    //             'source' => 'name',
    //         ],
    //     ];
    // }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $user = auth()->user();
            if ($user) {
                $model->created_by = $user->id;
            }
        });
    }

     
}
