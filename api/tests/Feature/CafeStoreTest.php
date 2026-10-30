<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CafeStoreTest extends TestCase
{
    use RefreshDatabase;

    private function datos(array $cambios = []): array
    {
        return array_merge([
            'tipo' => 'latte',
            'cucharaditas' => 2,
            'lugar' => 'Casa',
            'nota' => 'Muy rico',
        ], $cambios);
    }

    public function test_crea_un_cafe_y_convierte_a_ml_y_gramos(): void
    {
        $this->postJson('/api/cafes', $this->datos())
            ->assertCreated()
            ->assertJsonFragment(['tipo' => 'latte', 'cafe_ml' => 30, 'leche_ml' => 150, 'azucar_g' => 8]);

        $this->assertDatabaseHas('cafes', ['tipo' => 'latte', 'lugar' => 'Casa', 'azucar_g' => 8]);
    }

    public function test_espresso_no_agrega_leche(): void
    {
        $this->postJson('/api/cafes', $this->datos(['tipo' => 'espresso']))
            ->assertCreated()
            ->assertJsonFragment(['cafe_ml' => 30, 'leche_ml' => 0]);
    }

    public function test_la_nota_es_opcional(): void
    {
        $this->postJson('/api/cafes', $this->datos(['nota' => null]))->assertCreated();
    }

    public function test_rechaza_datos_invalidos(): void
    {
        $this->postJson('/api/cafes', $this->datos(['tipo' => 'mate']))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['lugar' => '']))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => 11]))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => -1]))->assertUnprocessable();
        $this->postJson('/api/cafes', $this->datos(['cucharaditas' => 1.5]))->assertUnprocessable();
        $this->postJson('/api/cafes', [])->assertUnprocessable();
    }
}
