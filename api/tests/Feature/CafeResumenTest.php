<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes/resumen`.
 */
class CafeResumenTest extends TestCase
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

    /** Sin cafés devuelve los últimos 10 días en cero, del más viejo al más nuevo. */
    public function test_devuelve_10_dias_en_cero(): void
    {
        $dias = $this->getJson('/api/cafes/resumen')->assertOk()->json('dias');

        $this->assertCount(10, $dias);
        $this->assertSame(today()->subDays(9)->toDateString(), $dias[0]['fecha']);
        $this->assertSame(today()->toDateString(), $dias[9]['fecha']);
        $this->assertSame(['fecha' => $dias[0]['fecha'], 'cafe_ml' => 0, 'leche_ml' => 0, 'azucar_g' => 0], $dias[0]);
    }

    /** Suma cada día por separado. */
    public function test_suma_los_cafes_de_cada_dia(): void
    {
        $this->cafe();
        $this->cafe(['tipo' => 'espresso', 'leche_ml' => 0, 'azucar_g' => 0]);
        $this->cafe(['created_at' => now()->subDays(3)]);

        $dias = $this->getJson('/api/cafes/resumen')->json('dias');

        $this->assertSame(['cafe_ml' => 60, 'leche_ml' => 150, 'azucar_g' => 8], collect($dias[9])->except('fecha')->all());
        $this->assertSame(['cafe_ml' => 30, 'leche_ml' => 150, 'azucar_g' => 8], collect($dias[6])->except('fecha')->all());
    }

    /** Los cafés de hace más de 10 días no aparecen. */
    public function test_ignora_cafes_de_hace_mas_de_10_dias(): void
    {
        $this->cafe(['created_at' => now()->subDays(10)]);

        $dias = $this->getJson('/api/cafes/resumen')->json('dias');

        $this->assertSame(0, array_sum(array_column($dias, 'cafe_ml')));
    }
}
