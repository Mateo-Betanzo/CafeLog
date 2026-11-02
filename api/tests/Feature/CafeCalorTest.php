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

    /** Sin cafés devuelve 7 filas (lunes a domingo) de 12 meses, todo en cero. */
    public function test_sin_cafes_devuelve_la_matriz_en_cero(): void
    {
        $respuesta = $this->getJson('/api/cafes/calor')->assertOk();

        $this->assertSame(2026, $respuesta->json('anio'));
        $filas = $respuesta->json('filas');
        $this->assertCount(7, $filas);
        $this->assertSame(array_fill(0, 12, 0), $filas[0]);
        $this->assertSame(0, array_sum(array_map('array_sum', $filas)));
    }

    /** Cuenta cada café en su día de la semana y su mes, e ignora otros años. */
    public function test_cuenta_por_dia_de_la_semana_y_mes(): void
    {
        $this->cafe('2026-11-04 08:00:00'); // miércoles de noviembre
        $this->cafe('2026-11-11 09:00:00'); // otro miércoles de noviembre
        $this->cafe('2026-01-05 10:00:00'); // lunes de enero
        $this->cafe('2026-12-27 10:00:00'); // domingo de diciembre
        $this->cafe('2025-11-05 10:00:00'); // otro año: no cuenta

        $filas = $this->getJson('/api/cafes/calor')->json('filas');

        $this->assertSame(2, $filas[2][10]);
        $this->assertSame(1, $filas[0][0]);
        $this->assertSame(1, $filas[6][11]);
        $this->assertSame(4, array_sum(array_map('array_sum', $filas)));
    }
}
