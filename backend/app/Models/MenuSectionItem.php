<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSectionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_section_id',
        'name',
        'menu_id',
    ];


    public function Variants()
    {
        return $this->hasMany(MenuSectionItemVariant::class, 'menu_section_item_id');
    }
}
