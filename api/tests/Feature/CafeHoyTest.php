<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes/hoy`.
 */
class CafeHoyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Crea un café con los datos mínimos, pisando los campos indicados.
     *
     * @param  array<string, mixed>  $cambios  Campos a sobrescribir.
     */
    private function cafe(array $cambios = []): Cafe
    {
        return Cafe::forceCreate(array_merge([
            'tipo' => 'latte',
            'cafe_ml' => 30,
            'leche_ml' => 150,
            'cucharaditas' => 2,
            'azucar_g' => 8,
        ], $cambios));
    }

    /** Sin cafés devuelve todo en cero. */
    public function test_sin_cafes_devuelve_ceros(): void
    {
        $this->getJson('/api/cafes/hoy')
            ->assertOk()
            ->assertExactJson(['total' => 0, 'cafe_ml' => 0, 'leche_ml' => 0, 'azucar_g' => 0]);
    }

    /** Suma los cafés de hoy e ignora los de ayer. */
    public function test_suma_los_cafes_de_hoy_e_ignora_los_de_ayer(): void
    {
        $this->cafe();
        $this->cafe(['tipo' => 'espresso', 'leche_ml' => 0, 'azucar_g' => 0]);
        $this->cafe(['created_at' => now()->subDay()]);

        $this->getJson('/api/cafes/hoy')
            ->assertOk()
            ->assertExactJson(['total' => 2, 'cafe_ml' => 60, 'leche_ml' => 150, 'azucar_g' => 8]);
    }
}
