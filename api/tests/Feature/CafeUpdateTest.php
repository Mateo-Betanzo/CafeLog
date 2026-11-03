<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `PUT /api/cafes/{id}`.
 */
class CafeUpdateTest extends TestCase
{
    use RefreshDatabase;

    /** Cambia el tipo y las cucharaditas y recalcula ml y gramos. */
    public function test_actualiza_y_recalcula_ml_y_gramos(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'latte', 'cucharaditas' => 2, 'nota' => 'Rico']);

        $this->putJson("/api/cafes/{$cafe->id}", ['tipo' => 'espresso', 'cucharaditas' => 0, 'nota' => 'Corto'])
            ->assertOk()
            ->assertJsonFragment(['tipo' => 'espresso', 'cafe_ml' => 30, 'leche_ml' => 0, 'azucar_g' => 0, 'nota' => 'Corto']);

        $this->assertDatabaseHas('cafes', ['id' => $cafe->id, 'tipo' => 'espresso', 'leche_ml' => 0, 'azucar_g' => 0]);
    }

    /** Un PUT sin nota la borra: reemplaza el café entero, igual que al crearlo. */
    public function test_sin_nota_la_borra(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'latte', 'cucharaditas' => 2, 'nota' => 'Rico']);

        $this->putJson("/api/cafes/{$cafe->id}", ['tipo' => 'latte', 'cucharaditas' => 2])->assertOk();

        $this->assertDatabaseHas('cafes', ['id' => $cafe->id, 'nota' => null]);
    }

    /** Datos inválidos responden 422 y no cambian el café. */
    public function test_rechaza_datos_invalidos(): void
    {
        $cafe = Cafe::registrar(['tipo' => 'latte', 'cucharaditas' => 2]);
        $url = "/api/cafes/{$cafe->id}";

        $this->putJson($url, ['tipo' => 'mate', 'cucharaditas' => 2])->assertUnprocessable();
        $this->putJson($url, ['tipo' => 'latte', 'cucharaditas' => 11])->assertUnprocessable();
        $this->putJson($url, ['tipo' => 'latte', 'cucharaditas' => -1])->assertUnprocessable();
        $this->putJson($url, [])->assertUnprocessable();

        $this->assertDatabaseHas('cafes', ['id' => $cafe->id, 'tipo' => 'latte', 'azucar_g' => 8]);
    }

    /** Un id inexistente responde 404. */
    public function test_id_inexistente_devuelve_404(): void
    {
        $this->putJson('/api/cafes/999', ['tipo' => 'latte', 'cucharaditas' => 2])->assertNotFound();
    }
}
