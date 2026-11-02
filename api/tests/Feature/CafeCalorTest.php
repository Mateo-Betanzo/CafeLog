<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de `GET /api/cafes/calor`.
 */
class CafeCalorTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Crea un café en la fecha indicada.
     *
     * @param  string  $fecha  Fecha y hora del café.
     */
    private function cafe(string $fecha): Cafe
    {
        return Cafe::forceCreate([
            'tipo' => 'espresso',
            'cafe_ml' => 30,
            'leche_ml' => 0,
            'cucharaditas' => 0,
            'azucar_g' => 0,
            'created_at' => $fecha,
        ]);
    }

    /** Fija "hoy" en un miércoles de 2026. */
    protected function setUp(): void
    {
        parent::setUp();
        $this->travelTo('2026-11-04 12:00:00');
    }

    /** Sin cafés devuelve los últimos 365 días, del más viejo a hoy, todo en cero. */
    public function test_sin_cafes_devuelve_365_dias_en_cero(): void
    {
        $dias = $this->getJson('/api/cafes/calor')->assertOk()->json('dias');

        $this->assertCount(365, $dias);
        $this->assertSame(['fecha' => '2025-11-05', 'total' => 0], $dias[0]);
        $this->assertSame(['fecha' => '2026-11-04', 'total' => 0], $dias[364]);
    }

    /** Cuenta los cafés en su día exacto e ignora los de hace más de 365 días. */
    public function test_cuenta_los_cafes_de_cada_dia(): void
    {
        $this->cafe('2026-11-04 08:00:00');
        $this->cafe('2026-11-04 17:00:00');
        $this->cafe('2025-11-05 10:00:00'); // primer día del rango
        $this->cafe('2025-11-04 10:00:00'); // un día afuera

        $dias = $this->getJson('/api/cafes/calor')->json('dias');

        $this->assertSame(2, $dias[364]['total']);
        $this->assertSame(1, $dias[0]['total']);
        $this->assertSame(3, array_sum(array_column($dias, 'total')));
    }
}
