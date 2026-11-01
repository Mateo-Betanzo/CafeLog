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

    /** Fija "hoy" en un miércoles para que los rangos sean predecibles. */
    protected function setUp(): void
    {
        parent::setUp();
        $this->travelTo('2026-11-04 12:00:00');
    }

    /** Sin periodo se usa la semana: lunes a domingo, en cero y en orden. */
    public function test_por_defecto_es_la_semana_calendario(): void
    {
        $barras = $this->getJson('/api/cafes/resumen')->assertOk()->json('barras');

        $this->assertCount(7, $barras);
        $this->assertSame('2026-11-02', $barras[0]['fecha']);
        $this->assertSame('2026-11-08', $barras[6]['fecha']);
        $this->assertSame(['fecha' => '2026-11-02', 'cafe_ml' => 0, 'leche_ml' => 0, 'azucar_g' => 0], $barras[0]);
    }

    /** La semana suma cada día por separado e ignora la semana anterior. */
    public function test_semana_suma_por_dia(): void
    {
        $this->cafe();
        $this->cafe(['tipo' => 'espresso', 'leche_ml' => 0, 'azucar_g' => 0]);
        $this->cafe(['created_at' => now()->subDays(2)]);
        $this->cafe(['created_at' => now()->subDays(3)]);

        $barras = $this->getJson('/api/cafes/resumen?periodo=semana')->json('barras');

        $this->assertSame(['cafe_ml' => 60, 'leche_ml' => 150, 'azucar_g' => 8], collect($barras[2])->except('fecha')->all());
        $this->assertSame(['cafe_ml' => 30, 'leche_ml' => 150, 'azucar_g' => 8], collect($barras[0])->except('fecha')->all());
        $this->assertSame(90, array_sum(array_column($barras, 'cafe_ml'))); // el del domingo 1 queda afuera
    }

    /** El mes va del 1 al último día e ignora el mes anterior. */
    public function test_mes_tiene_todos_los_dias_del_mes(): void
    {
        $this->cafe(['created_at' => now()->subMonth()]);
        $this->cafe(['created_at' => '2026-11-01 08:00:00']);

        $barras = $this->getJson('/api/cafes/resumen?periodo=mes')->json('barras');

        $this->assertCount(30, $barras);
        $this->assertSame('2026-11-01', $barras[0]['fecha']);
        $this->assertSame('2026-11-30', $barras[29]['fecha']);
        $this->assertSame(30, array_sum(array_column($barras, 'cafe_ml')));
    }

    /** El año tiene una barra por mes, de enero a diciembre. */
    public function test_anio_tiene_una_barra_por_mes(): void
    {
        $this->cafe();
        $this->cafe(['created_at' => '2026-01-15 10:00:00']);
        $this->cafe(['created_at' => '2025-12-31 10:00:00']);

        $barras = $this->getJson('/api/cafes/resumen?periodo=anio')->json('barras');

        $this->assertCount(12, $barras);
        $this->assertSame('2026-01', $barras[0]['fecha']);
        $this->assertSame('2026-12', $barras[11]['fecha']);
        $this->assertSame(30, $barras[0]['cafe_ml']);
        $this->assertSame(30, $barras[10]['cafe_ml']);
        $this->assertSame(60, array_sum(array_column($barras, 'cafe_ml')));
    }

    /** Un periodo desconocido responde 422. */
    public function test_periodo_invalido_devuelve_422(): void
    {
        $this->getJson('/api/cafes/resumen?periodo=siglo')->assertUnprocessable();
    }
}
