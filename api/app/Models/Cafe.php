<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['tipo', 'cafe_ml', 'leche_ml', 'cucharaditas', 'azucar_g', 'lugar', 'nota'])]
class Cafe extends Model
{
    public const GRAMOS_POR_CUCHARADITA = 4;

    // tipo => [café ml, leche ml]
    public const TIPOS = [
        'espresso' => [30, 0],
        'americano' => [30, 0],
        'cortado' => [30, 30],
        'latte' => [30, 150],
        'capuchino' => [30, 120],
    ];
}
