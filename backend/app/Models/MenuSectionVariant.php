<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSectionVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'menu_section_id',
        'menu_id',
        'name',
    ];


    //items
    public function Items()
    {
        return $this->hasMany(MenuSectionItemVariant::class, 'menu_section_variant_id');
    }
}
