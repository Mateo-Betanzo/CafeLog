<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `POST /api/cafes`.
 */
class CafeStoreTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Devuelve datos válidos de un café, pisando los campos indicados.
     *
     * @param  array<string, mixed>  $cambios  Campos a sobrescribir.
     * @return array<string, mixed>
     */
    private function datos(array $cambios = []): array
    {
        return array_merge([
            'tipo' => 'latte',
            'cucharaditas' => 2,
            'nota' => 'Muy rico',
        ], $cambios);
    }

    /** Crea el café y guarda la conversión a ml y gramos. */
    public function test_crea_un_cafe_y_convierte_a_ml_y_gramos(): void
    {
        $this->postJson('/api/cafes', $this->datos())
            ->assertCreated()
            ->assertJsonFragment(['tipo' => 'latte', 'cafe_ml' => 30, 'leche_ml' => 150, 'azucar_g' => 8]);

        $this->assertDatabaseHas('cafes', ['tipo' => 'latte', 'azucar_g' => 8]);
    }

    /** Un espresso no suma leche. */
    public function test_espresso_no_agrega_leche(): void
    {
        $this->postJson('/api/cafes', $this->datos(['tipo' => 'espresso']))
            ->assertCreated()
            ->assertJsonFragment(['cafe_ml' => 30, 'leche_ml' => 0]);
    }

    /** La nota puede omitirse. */
    public function test_la_nota_es_opcional(): void
    {
        $this->postJson('/api/cafes', $this->datos(['nota' => null]))->assertCreated();
    }

    /** Datos inválidos responden 422. */
    public function test_rechaza_datos_invalidos(): void
    {
        $this->postJson('/api/cafes', $this->datos(['tipo' => 'mate']))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => 11]))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => -1]))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => 1.5]))->assertUnprocessable();
        $this->postJson('/api/cafes', [])->assertUnprocessable();
    }

    /** Los mensajes de validación salen en español. */
    public function test_los_mensajes_de_validacion_estan_en_espanol(): void
    {
        $this->postJson('/api/cafes', $this->datos(['tipo' => 'mate']))
            ->assertJsonPath('errors.tipo.0', 'El valor elegido en tipo no es válido.');

        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => 11]))
            ->assertJsonPath('errors.cucharaditas.0', 'El campo cucharaditas no puede ser mayor que 10.');

        $this->postJson('/api/cafes', [])
            ->assertJsonPath('errors.tipo.0', 'El campo tipo es obligatorio.')
            ->assertJsonPath('message', 'El campo tipo es obligatorio. (y 1 error más)');
    }
}
