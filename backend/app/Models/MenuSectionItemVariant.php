<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSectionItemVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'menu_section_item_id',
        'price',
        'menu_id',
        'menu_section_id',
        'menu_section_variant_id'
    ];


    //item
    public function Item()
    {
        return $this->belongsTo(MenuSectionItem::class, 'menu_section_item_id');
    }
}
