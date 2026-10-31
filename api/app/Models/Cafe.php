<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Registro de un café tomado.
 *
 * Guarda las cantidades ya convertidas a ml (café y leche) y gramos (azúcar).
 *
 * @property int $id
 * @property string $tipo
 * @property int $cafe_ml
 * @property int $leche_ml
 * @property int $cucharaditas
 * @property int $azucar_g
 * @property string|null $nota
 */
#[Fillable(['tipo', 'cafe_ml', 'leche_ml', 'cucharaditas', 'azucar_g', 'nota'])]
class Cafe extends Model
{
    /** @var int Gramos de azúcar que lleva una cucharadita. */
    public const GRAMOS_POR_CUCHARADITA = 4;

    /**
     * Equivalencia de cada tipo de café a mililitros.
     *
     * @var array<string, array{int, int}> tipo => [café ml, leche ml]
     */
    public const TIPOS = [
        'espresso' => [30, 0],
        'americano' => [30, 0],
        'cortado' => [30, 30],
        'latte' => [30, 150],
        'capuchino' => [30, 120],
    ];
}
