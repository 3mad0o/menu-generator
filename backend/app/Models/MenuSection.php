<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSection extends Model
{

    use HasFactory;

    protected $fillable = [
        'menu_id',
        'title',
        'order'
    ];




    public function Variants()
    {
        return $this->hasMany(MenuSectionVariant::class, 'menu_section_id');
    }


    //items
    public function Items()
    {
        return $this->hasMany(MenuSectionItem::class, 'menu_section_id');
    }
}
