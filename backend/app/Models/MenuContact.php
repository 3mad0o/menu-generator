<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'type',
        'value',
    ];
}
