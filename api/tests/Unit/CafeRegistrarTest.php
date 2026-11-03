<?php

namespace Tests\Unit;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `Cafe::registrar`.
 */
class CafeRegistrarTest extends TestCase
{
    use RefreshDatabase;

    /** Convierte el tipo a ml y las cucharaditas a gramos, y guarda el café. */
    public function test_calcula_ml_y_gramos_y_guarda_el_cafe(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'latte', 'cucharaditas' => 2, 'nota' => 'Rico']);

        $this->assertSame([30, 150, 8], [$cafe->cafe_ml, $cafe->leche_ml, $cafe->azucar_g]);
        $this->assertDatabaseHas('cafes', ['id' => $cafe->id, 'tipo' => 'latte', 'nota' => 'Rico']);
    }

    /** Sin cucharaditas no hay azúcar. */
    public function test_sin_cucharaditas_no_hay_azucar(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'espresso', 'cucharaditas' => 0]);

        $this->assertSame([30, 0, 0], [$cafe->cafe_ml, $cafe->leche_ml, $cafe->azucar_g]);
    }
}
