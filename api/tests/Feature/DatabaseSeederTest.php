<?php

namespace Tests\Feature;

use App\Models\Cafe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pruebas de los datos de ejemplo (`DatabaseSeeder`).
 */
class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    /** Carga al menos 5 cafés, con tipos válidos y conversiones coherentes, en días distintos. */
    public function test_carga_cafes_de_ejemplo(): void
    {
        $this->seed();

        $cafes = Cafe::all();
        $this->assertGreaterThanOrEqual(5, $cafes->count());

        foreach ($cafes as $cafe) {
            $this->assertArrayHasKey($cafe->tipo, Cafe::TIPOS);
            $this->assertSame(Cafe::TIPOS[$cafe->tipo], [$cafe->cafe_ml, $cafe->leche_ml]);
            $this->assertSame($cafe->cucharaditas * Cafe::GRAMOS_POR_CUCHARADITA, $cafe->azucar_g);
        }

        $this->assertGreaterThan(1, $cafes->map(fn (Cafe $cafe) => $cafe->created_at->toDateString())->unique()->count());
    }
}
