<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory;

   protected $fillable = [
       'title',
       'store_name',
       'store_logo',
       'store_subtitle',
       'slug',
       'user_id',
       'device_id',
   ];



   public function Contacts() :HasMany
   {
       return $this->hasMany(MenuContact::class);
   }

    public function Sections() :HasMany
    {
         return $this->hasMany(MenuSection::class);
    }



}
