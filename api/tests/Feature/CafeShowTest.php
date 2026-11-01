<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes/{id}`.
 */
class CafeShowTest extends TestCase
{
    use RefreshDatabase;

    /** Un id existente devuelve el café. */
    public function test_devuelve_el_cafe(): void
    {
        $cafe = Cafe::forceCreate([
            'tipo' => 'cortado',
            'cafe_ml' => 30,
            'leche_ml' => 30,
            'cucharaditas' => 1,
            'azucar_g' => 4,
            'nota' => 'Con tostadas',
        ]);

        $this->getJson("/api/cafes/{$cafe->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $cafe->id, 'tipo' => 'cortado', 'leche_ml' => 30, 'nota' => 'Con tostadas']);
    }

    /** Un id inexistente responde 404. */
    public function test_id_inexistente_devuelve_404(): void
    {
        $this->getJson('/api/cafes/999')->assertNotFound();
    }
}
