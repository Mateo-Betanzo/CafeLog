<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes/tipos`.
 */
class CafeTiposTest extends TestCase
{
    /** Devuelve los tipos de la API y el máximo de cucharaditas. */
    public function test_devuelve_los_tipos_y_el_maximo_de_cucharaditas(): void
    {
        $this->getJson('/api/cafes/tipos')
            ->assertOk()
            ->assertExactJson([
                'tipos' => ['espresso', 'americano', 'cortado', 'latte', 'capuchino'],
                'max_cucharaditas' => Cafe::MAX_CUCHARADITAS,
            ]);
    }
}
