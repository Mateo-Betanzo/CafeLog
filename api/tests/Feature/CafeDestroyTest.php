<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `DELETE /api/cafes/{id}`.
 */
class CafeDestroyTest extends TestCase
{
    use RefreshDatabase;

    /** Borra el café y responde 200 con un mensaje. */
    public function test_borra_el_cafe(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'latte', 'cucharaditas' => 2]);

        $this->deleteJson("/api/cafes/{$cafe->id}")
            ->assertOk()
            ->assertExactJson(['mensaje' => 'Café eliminado']);

        $this->assertDatabaseMissing('cafes', ['id' => $cafe->id]);
    }

    /** Un id inexistente (o ya borrado) responde 404. */
    public function test_id_inexistente_devuelve_404(): void
    {
        $this->deleteJson('/api/cafes/999')->assertNotFound();
    }
}
