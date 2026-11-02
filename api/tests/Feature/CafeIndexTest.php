<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes`.
 */
class CafeIndexTest extends TestCase
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
            'tipo' => 'espresso',
            'cafe_ml' => 30,
            'leche_ml' => 0,
            'cucharaditas' => 0,
            'azucar_g' => 0,
        ], $cambios));
    }

    /** Sin cafés responde 200 con la lista vacía. */
    public function test_sin_cafes_devuelve_lista_vacia(): void
    {
        $this->getJson('/api/cafes')
            ->assertOk()
            ->assertJsonPath('data', [])
            ->assertJsonPath('last_page', 1);
    }

    /** Los cafés vienen del más nuevo al más viejo. */
    public function test_ordena_del_mas_nuevo_al_mas_viejo(): void
    {
        $viejo = $this->cafe(['created_at' => now()->subDays(2)]);
        $nuevo = $this->cafe(['created_at' => now()]);
        $medio = $this->cafe(['created_at' => now()->subDay()]);

        $ids = $this->getJson('/api/cafes')->assertOk()->json('data.*.id');

        $this->assertSame([$nuevo->id, $medio->id, $viejo->id], $ids);
    }

    /** Pagina de a 10 y la segunda página trae el resto. */
    public function test_pagina_de_a_10(): void
    {
        foreach (range(1, 12) as $i) {
            $this->cafe(['created_at' => now()->subMinutes($i)]);
        }

        $primera = $this->getJson('/api/cafes')->assertOk();
        $segunda = $this->getJson('/api/cafes?page=2')->assertOk();

        $this->assertCount(10, $primera->json('data'));
        $this->assertSame(2, $primera->json('last_page'));
        $this->assertCount(2, $segunda->json('data'));
    }
}
